import { createClient } from '@/utils/supabase/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { FC, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import PostCard from './PostCard';
import { cn } from '@/utils/style';

const supabase = createClient();

interface PostListProps {
  category?: string;
  tag?: string;
  className?: string;
}

const PostList: FC<PostListProps> = ({ category, tag, className }) => {
  const { ref, inView } = useInView();
  // infinite query를 사용하여 페이지별로 데이터를 가져옴
  const {
    data: postPages,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['posts'],
    // 페이지별로 데이터를 가져오는 함수
    queryFn: async ({ pageParam }) => {
      let request = supabase.from('Post').select('*');
      // category와 tag가 있으면 해당하는 데이터만 가져오도록 쿼리를 수정
      if (category) {
        request = request.eq('category', category);
      }
      if (tag) {
        request = request.contains('tags', [tag]);
      }

      const { data, error } = await request
        .order('created_at', { ascending: false })
        // 4개의 게시물 가져오기
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
    <div className={cn('flex flex-col items-center gap-8 pt-20', className)}>
      <h1 className={cn('text-2xl font-medium', !category && !tag && 'hidden')}>
        {category ? category : `#${tag}`}
      </h1>
      <div className="container grid grid-cols-2 gap-x-4 gap-y-6 pb-24 lg:gap-x-7 lg:gap-y-12">
        {postPages?.pages
          ?.flatMap((page) => page.posts)
          ?.map((post) => <PostCard key={post.id} {...post} />)}
      </div>
      <div ref={ref} />
    </div>
  );
};

export default PostList;
