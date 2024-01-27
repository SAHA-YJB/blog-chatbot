import PostCard from '@/components/PostCard';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { GetServerSideProps } from 'next';

type CategoryPostsProps = {
  category: string;
};

const supabase = createClient();

export default function CategoyPosts({ category }: CategoryPostsProps) {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .eq('category', category)
        .order('created_at', { ascending: false });
      if (!data)
        console.log('[category]데이터 가져오기를 실패 다시 한번 시도해주세요.');
      return data;
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 pt-20">
      <h1 className="text-2xl font-medium"># {category}</h1>
      <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 lg:gap-x-7 lg:gap-y-12">
        {posts?.map((post) => <PostCard key={post.id} {...post} />)}
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps<
  CategoryPostsProps
> = async ({ query }) => {
  return {
    props: {
      category: query.category as string,
    },
  };
};