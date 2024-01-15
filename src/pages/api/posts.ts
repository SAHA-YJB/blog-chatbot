// 사용자로부터 제목, 내용, 카테고리, 태그, 미리보기 이미지를 받아서 블로그 포스트를 생성
// 생성된 포스트 정보를 응답으로 반환
import { Post, PostRequest } from '@/types';
import { createClient } from '@/utils/supabase/server';
import type { StorageError } from '@supabase/storage-js';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

// 페이지스라우터는 설정해야함
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | StorageError>,
) {
  try {
    // formidable을 사용하여 multipart/form-data를 파싱
    const form = formidable();
    const [fields, files] = await form.parse(req);

    let preview_image_url: string | null = null;

    const supabase = await createClient(req.cookies);

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
        if (error) {
          res.status(402).json(error);
        }
      }
    }
    const { title, content, category, tags } = fields;
    const postRequest = {
      title: title?.[0],
      category: category?.[0],
      tags: tags?.[0],
      content: content?.[0],
      preview_image_url,
    } as PostRequest;

    const { data, error } = await supabase
      .from('Post')
      .insert([postRequest])
      .select();
    if (data && data.length === 1) {
      const { tags, ...rest } = data[0];
      res.status(200).json({ ...rest, tags: JSON.parse(tags) as string[] });
    } else {
      throw error;
    }
  } catch (error) {
    console.error('응답 에러', error);
    res.status(500).end();
  }
}
