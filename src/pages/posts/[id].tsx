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

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { id } = query;
  return {
    props: {
      id,
    },
  };
};
