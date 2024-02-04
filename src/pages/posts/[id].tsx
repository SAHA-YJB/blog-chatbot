import { createClient } from '@/utils/supabase/server';
import { GetServerSideProps } from 'next';
import { Post } from '@/types/index';
import Link from 'next/link';
import Image from 'next/image';
import { MarkdownViewer } from '@/components/Markdown';
import { format } from 'date-fns';

type PostProps = Post;

export default function PostId({
  id,
  title,
  category,
  created_at,
  preview_image_url,
  tags,
  content,
}: PostProps) {
  return (
    <div className="container flex flex-col gap-8 pb-40 pt-20">
      <h1 className="text-4xl font-bold">{title}</h1>
      <div className="flex flex-row items-center gap-2">
        <Link
          href={`/categories/${category}`}
          className="rounded-md bg-slate-800 px-2 py-1 text-sm text-slate-200"
        >
          {category}
        </Link>
        {tags.map((tag) => (
          <Link
            href={`/tags/${tag}`}
            key={tag}
            className="rounded-md bg-slate-200 px-2 py-1 text-sm text-slate-500"
          >
            {tag}
          </Link>
        ))}
        <div className="text-sm text-gray-500">
          {format(new Date(created_at), 'yyyy-MM월-dd일 HH:mm')}
        </div>
      </div>
      {preview_image_url && (
        // 이미지 비율 채우기
        <Image
          src={preview_image_url}
          alt="preview image"
          width={0}
          height={0}
          sizes="100vw"
          className="h-auto w-full"
        />
      )}
      <MarkdownViewer className="min-w-full" source={content} />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const { id } = query;
  // 현재 요청의 쿠키를 사용하여 Supabase 클라이언트를 생성
  const supabase = createClient(req.cookies);
  // 'Post'라는 테이블에서 모든(*) 정보를 선택하고 그 중 'id'가 특정 번호(id)와 일치하는 것을 선택
  const { data } = await supabase.from('Post').select('*').eq('id', Number(id));

  if (!data || !data[0]) {
    return {
      notFound: true,
    };
  }
  const { title, category, created_at, preview_image_url, tags, content } =
    data[0];
  return {
    props: {
      id,
      title,
      category,
      created_at,
      preview_image_url,
      tags: JSON.parse(tags) as string[],
      content,
    },
  };
};
