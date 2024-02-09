import Button from '@/components/Button';
import Input from '@/components/Input';
import { MarkdownEditor } from '@/components/Markdown';
import { useCategories, useTags } from '@/utils/hook';
import { createClient } from '@/utils/supabase/client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { FormEvent, useRef, useState } from 'react';
import CreatableSelect from 'react-select/creatable';

const supabase = createClient();

export default function Write() {
  const fileRef = useRef<HTMLInputElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);

  const [tags, setTags] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');

  const router = useRouter();

  // 카테고리와 태그를 가져옴
  const { data: existingCategories } = useCategories();
  const { data: existingTags } = useTags();

  // form의 제출을 처리하는 함수를 정의
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
      // FormData 객체를 생성하고 필드 값을 추가
      const formData = new FormData();

      formData.append('title', titleRef.current?.value ?? '');
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('content', content);

      if (fileRef.current?.files?.[0]) {
        formData.append('preview_image', fileRef.current.files[0]);
      }
      // axios를 사용하여 '/api/posts' 엔드포인트에 POST 요청을 보냄
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
    <div className="container flex flex-col pb-20 pt-12">
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
            options={(existingCategories ?? []).map((category) => ({
              label: category,
              value: category,
            }))}
            placeholder="카테고리"
            isMulti={false}
            onChange={(e) => e && setCategory(e.value)}
          />
          <CreatableSelect
            instanceId="tags"
            options={(existingTags ?? []).map((tag) => ({
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
        <Button type="submit" className="mt-4">
          작성하기
        </Button>
      </form>
    </div>
  );
}
