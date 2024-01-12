import { Post, PostRequest } from '@/types';
import { createClient } from '@/utils/supabase/server';
import type { StorageError } from '@supabase/storage-js';
import formidable from 'formidable';
import IncomingForm from 'formidable';
import { readFileSync } from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post | StorageError>,
) {
  try {
    console.log('응답시작');
    const form = IncomingForm();
    const [fields, files] = await form.parse(req);
    console.log('응답시작2');

    let preview_image_url: string | null = null;

    const supabase = await createClient(req.cookies);
    console.log('응답시작3');
    if (files.preview_image?.length === 1) {
      const file = files.preview_image[0];
      const fileContent = await readFileSync(file.filepath);
      const fileName = `${file.newFilename}_${file.originalFilename}`;
      console.log('응답시작4');
      const { data: uploadData, error } = await supabase.storage
        .from('blog-image')
        .upload(fileName, fileContent, {
          contentType: file.mimetype ?? undefined,
        });
      console.log('응답시작5');
      if (error) {
        res.status(403).json(error);
      }
      if (uploadData?.path) {
        console.log('응답시작6');
        const { data } = await supabase.storage
          .from('blog-image')
          .getPublicUrl(uploadData.path);
        preview_image_url = data.publicUrl;
        console.log('응답시작7');
        if (error) {
          res.status(402).json(error);
        }
      }
    }
    console.log('응답시작8');
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
    console.log('응답시작9');
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
