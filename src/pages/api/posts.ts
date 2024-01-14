// 사용자로부터 제목, 내용, 카테고리, 태그, 미리보기 이미지를 받아서 블로그 포스트를 생성
// 생성된 포스트 정보를 응답으로 반환
import { Post, PostRequest } from '@/types';
import { createClient } from '@/utils/supabase/server';
import type { StorageError } from '@supabase/storage-js';
import formidable from 'formidable';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | StorageError | { error: string }>,
) {
  try {
    const form = formidable();
    const [fields, files] = await form.parse(req);

    if (!fields.title || !fields.content || !fields.category || !fields.tags) {
      res.status(400).json({ error: '각 필드를 다시 확인해주세요' });
      return;
    }

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
        // 이미지 업로드 에러 처리
        res.status(403).json({ error: '이미지 업로드 에러' });
        return;
      }
      if (uploadData?.path) {
        const { data } = await supabase.storage
          .from('blog-image')
          .getPublicUrl(uploadData.path);
        preview_image_url = data.publicUrl;
      }
    }

    const { title, content, category, tags } = fields;
    const postRequest = {
      title: title?.[0],
      content: content?.[0],
      category: category?.[0],
      tags: tags?.[0],
      preview_image_url,
    } as PostRequest;

    const { data, error } = await supabase
      .from('Post')
      .insert([postRequest])
      .select();
    if (error) {
      // 데이터 삽입 에러 처리
      res.status(500).json({ error: '데이터베이스 삽입 에러' });
      return;
    }

    if (data && data.length === 1) {
      const { tags, ...rest } = data[0];
      res.status(200).json({ ...rest, tags: JSON.parse(tags) as string[] });
    } else {
      res.status(500).end();
    }
  } catch (error) {
    res.status(500).json({ error: 'Unexpected error occurred' });
  }
}
