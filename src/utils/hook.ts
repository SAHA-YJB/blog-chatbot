import { useQuery } from '@tanstack/react-query';
import { createClient } from './supabase/client';
const supabase = createClient();

// useCategories라는 custom hook을 정의
// 블로그 포스트의 모든 카테고리를 데이터베이스에서 가져옴
export const useCategories = () =>
  useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      // 'Post' 테이블에서 'category' 컬럼의 데이터를 모두 가져옴
      const { data } = await supabase.from('Post').select('category');
      // 중복된 카테고리를 제거하고, 배열로 변환하여 반환
      return Array.from(new Set(data?.map((post) => post.category)));
    },
  });

export const useTags = () =>
  useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data } = await supabase.from('Post').select('tags');
      // 각 post의 태그 배열을 하나의 배열로 합치고, 중복된 태그를 제거한 후 배열로 변환하여 반환
      return Array.from(
        new Set(data?.flatMap((post) => JSON.parse(post.tags))),
      );
    },
  });
