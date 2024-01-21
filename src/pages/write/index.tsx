import Input from '@/components/Input';
import { MarkdownEditor } from '@/components/Markdown';
import { createClient } from '@/utils/supabase/server';
import axios from 'axios';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/navigation';
import { title } from 'process';
import { FormEvent, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

interface WriteProps {
  existingTags: string[];
  existingCategories: string[];
}

export default function Write({
  existingTags,
  existingCategories,
}: WriteProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titleRef.current?.value || titleRef.current.value.length === 0) {
      return alert('제목을 입력해주세요');
    }
    if (category.length === 0) {
      return alert('카테고리를 입력해주세요');
    }
    if (tags.length === 0) {
      return alert('태그를 입력해주세요');
    }
    if (content.length === 0) {
      return alert('내용을 입력해주세요');
    }
    try {
      const formData = new FormData();

      formData.append('title', titleRef.current?.value ?? '');
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('content', content);

      if (fileRef.current?.files?.[0]) {
        formData.append('preview_image', fileRef.current.files[0]);
      }
      const response = await axios.post('/api/posts', formData);
      const { data } = response;

      if (data.id) {
        router.push(`/posts/${data.id}`);
      }
    } catch (error) {
      console.error('요청 에러', error);
    }
  };

  return (
    <div className="container mx-auto flex flex-col px-4 pb-20 pt-12">
      <h1 className="mb-8 text-2xl font-medium">새로운 글</h1>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="제목"
            className="rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400"
            ref={titleRef}
          />
          <Input
            type="file"
            accept="image/*"
            className="rounded-md border border-gray-300 p-2 transition-all hover:border-gray-400"
            ref={fileRef}
          />
          <CreatableSelect
            instanceId="category"
            options={existingCategories.map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="카테고리"
            isMulti={false}
            onChange={(e) => e && setCategory(e.value)}
          />
          <CreatableSelect
            instanceId="tags"
            options={existingTags.map((tag) => ({
              label: tag,
              value: tag,
            }))}
            placeholder="태그"
            isMulti
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
  const { data } = await supabase.from('Post').select('category, tags');

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
