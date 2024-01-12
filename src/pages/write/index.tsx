import { MarkdownEditor } from '@/components/Markdown';
import { createClient } from '@/utils/supabase/server';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import ReactSelect from 'react-select';

interface WriteProps {
  existingTags: string[];
  existingCategories: string[];
}

export default function Write({
  existingTags,
  existingCategories,
}: WriteProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', title);
    formData.append('tags', tags);
    formData.append('category', category);
    formData.append('content', content);

    if (fileRef.current?.files?.[0]) {
      formData.append('preview_image', fileRef.current.files[0]);
    }

    const response = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    });

    const data = await response.json();
    if (data.id) {
      router.push(`/posts/${data.id}`);
    }
  };

  return (
    <div className="container mx-auto flex flex-col px-4 pb-20 pt-12">
      <h1 className="mb-8 text-2xl font-medium">새로운 글</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="제목"
            className="rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400"
            ref={fileRef}
          />
          <ReactSelect
            options={existingCategories.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="카테고리"
            isMulti={false}
            onChange={(e) => e && setCategory(e.value)}
          />
          <ReactSelect
            options={existingTags.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            placeholder="태그"
            isMulti={true}
            onChange={(e) =>
              e && setTags(JSON.stringify(e.map((e) => e.value)))
            }
          />
          <MarkdownEditor
            height={500}
            value={content}
            onChange={(e) => setContent(e ?? '')}
          />
        </div>
        <button
          type="submit"
          className="mt-4 w-full rounded-md bg-gray-800 py-2 text-white hover:bg-slate-700"
        >
          작성하기
        </button>
      </form>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<WriteProps> = async ({
  req,
}) => {
  const supabase = createClient(req.cookies);
  const { data } = await supabase.from('Post').select('tags, category');

  return {
    props: {
      existingCategories: Array.from(
        new Set(data?.map((post) => post.category)),
      ),
      existingTags: Array.from(
        new Set(data?.flatMap((post) => JSON.parse(post.tags))),
      ),
    },
  };
};
