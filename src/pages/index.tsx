import PostCard from '@/components/PostCard';
import { createClient } from '@/utils/supabase/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
const supabase = createClient();

export default function Home() {
  const { ref, inView } = useInView();
  const {
    data: postPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .order('created_at', { ascending: false })
        // 10개의 게시물 가져오기
        .range(pageParam, pageParam + 4);
      if (error) {
        console.log('포스트 데이터 패칭 에러', error);
      }
      if (!data) {
        return {
          posts: [],
          nextPage: null,
        };
      }
      return {
        posts: data,
        nextPage: data.length === 5 ? pageParam + 5 : null,
      };
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
  });

  useEffect(() => {
    //ref가 보이고 다음 페이지가 있으면 다음 페이지를 가져옴.
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  return (
    <div className="flex flex-col">
      <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 pt-20 lg:gap-x-7 lg:gap-y-12">
        {postPages?.pages
          ?.flatMap((page) => page.posts)
          ?.map((post) => <PostCard key={post.id} {...post} />)}
      </div>
      <div ref={ref} />
    </div>
  );
}
