import PostCard from '@/components/PostCard';
import { createClient } from '@/utils/supabase/client';
import { useQuery } from '@tanstack/react-query';

const supabase = createClient();

export default function Home() {
  const { data: posts } = useQuery({
    queryKey: ['posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Post')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.log('포스트 데이터 패칭 에러', error);
      }
      if (!data) {
        console.log('데이터 가져오기를 실패했습니다');
      }
      return data;
    },
  });

  return (
    <div className="container mx-auto grid grid-cols-2 gap-x-4 gap-y-6 px-4 pb-24 pt-20 lg:gap-x-7 lg:gap-y-12">
      {posts?.map((post) => <PostCard key={post.id} {...post} />)}
    </div>
  );
}
