// 사용자로부터 제목, 내용, 카테고리, 태그, 미리보기 이미지를 받아서 블로그 포스트를 생성
// 생성된 포스트 정보를 응답으로 반환
import { Post, PostRequest } from '@/types';
import { createClient } from '@/utils/supabase/server';
import type { StorageError } from '@supabase/storage-js';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

// 페이지스라우터는 설정해야함
// Next.js의 API 설정을 정의
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | StorageError | { error: string }>,
) {
  try {
    // 요청 메소드가 POST가 아닌 경우 405 상태 코드를 응답하고 종료
    if (req.method !== 'POST') {
      res.status(405).end();
      return;
    }
    // formidable을 사용하여 multipart/form-data를 파싱
    const form = formidable();
    const [fields, files] = await form.parse(req);

    let preview_image_url: string | null = null;

    const supabase = await createClient(req.cookies);

    // 미리보기 이미지 파일이 있다면 스토리지에 업로드하고 그 URL을 가져옴
    if (files.preview_image?.length === 1) {
      const file = files.preview_image[0];
      const fileContent = await readFileSync(file.filepath);
      const fileName = `${file.newFilename}_${file.originalFilename}`;

      const { data: uploadData, error } = await supabase.storage
        .from('blog-image')
        .upload(fileName, fileContent, {
          contentType: file.mimetype ?? undefined,
        });
      if (error) {
        res.status(403).json(error);
      }
      if (uploadData?.path) {
        const { data } = await supabase.storage
          .from('blog-image')
          .getPublicUrl(uploadData.path);
        preview_image_url = data.publicUrl;
      }
    }
    // 필드 값을 가져와 포스트 요청 객체를 생성
    const { title, content, category, tags } = fields;
    const postRequest = {
      title: title?.[0],
      content: content?.[0],
      category: category?.[0],
      tags: tags?.[0],
      preview_image_url,
    } as PostRequest;

    // 생성된 포스트 요청 객체로 새 포스트를 데이터베이스에 삽입
    const { data } = await supabase.from('Post').insert([postRequest]).select();

    // 삽입된 데이터가 있으면 그 데이터를 응답으로 반환하고, 아니면 500 상태 코드를 응답
    if (data && data.length === 1) {
      const { tags, ...rest } = data[0];
      res.status(200).json({ ...rest, tags: JSON.parse(tags) as string[] });
    } else {
      res.status(500).end();
    }
  } catch (error) {
    console.error(error);
    res.status(500).end();
  }
}
