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
  const supabase = createClient(req.cookies);
  const response = await supabase.from('Post').select('*').eq('id', Number(id));
  console.log(response);
  return {
    props: {
      id,
    },
  };
};
