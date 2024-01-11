import { createClient } from '@/utils/supabase/server';
import { GetServerSideProps } from 'next';

interface PostIdProps {
  id: string;
}

export default function PostId({ id }: PostIdProps) {
  return (
    <div className="flex">
      <h1>dummy PostId {id}</h1>
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
  const response = await supabase.from('Post').select('*').eq('id', Number(id));
  console.log(response);
  return {
    props: {
      id,
    },
  };
};
