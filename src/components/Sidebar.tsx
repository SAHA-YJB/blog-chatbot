import { cn } from '@/utils/style';
import Link from 'next/link';
import React, { FC } from 'react';
import { AiFillGithub, AiFillFileText, AiOutlineClose } from 'react-icons/ai';
import IconButton from './IconButton';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@/utils/supabase/client';

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
}

const supabase = createClient();

const Sidebar: FC<SidebarProps> = ({ isOpen, close }) => {
  const { data: existingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data } = await supabase.from('Post').select('category');
      return Array.from(new Set(data?.map((post) => post.category)));
    },
  });

  return (
    <div
      className={cn(
        'absolute z-10 min-h-screen flex-col gap-6 border-r bg-white p-10 pr-6 text-base lg:relative',
        isOpen ? 'flex ' : 'hidden',
      )}
    >
      <div className="flex justify-end lg:hidden">
        <IconButton Icon={AiOutlineClose} onClick={close} />
      </div>
      <Link href="/" className="w-48 font-medium text-gray-600 hover:underline">
        홈
      </Link>
      <Link
        href="/tags"
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        태그
      </Link>
      {existingCategories?.map((category) => (
        <Link
          key={category}
          href={`/category/${category}`}
          className="w-48 font-medium text-gray-600 hover:underline"
        >
          {category}
        </Link>
      ))}

      <div className="mt-10 flex items-center gap-4">
        <IconButton
          href="https://lumbar-emoji-10f.notion.site/1504565fccb94676973d3a336daa946f?pvs=4"
          target="_blank"
          Icon={AiFillFileText}
          component={Link}
        />
        <IconButton
          Icon={AiFillGithub}
          target="_blank"
          component={Link}
          href="https://github.com/SAHA-YJB"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="방문자 배지"
          src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https%3A%2F%2Fblod-chatbot.vercel.app&count_bg=%2379C83D&title_bg=%23555555&icon=&icon_color=%23E7E7E7&title=%EB%B0%A9%EB%AC%B8%EC%9E%90&edge_flat=false"
        />
      </div>
    </div>
  );
};

export default Sidebar;
