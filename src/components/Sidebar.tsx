import { cn } from '@/utils/style';
import Link from 'next/link';
import React, { FC } from 'react';
import { AiFillGithub, AiFillFileText, AiOutlineClose } from 'react-icons/ai';
import IconButton from './IconButton';

interface SidebarProps {
  isOpen: boolean;
  close: () => void;
}

const Sidebar: FC<SidebarProps> = ({ isOpen, close }) => {
  return (
    <div
      className={cn(
        'absolute min-h-screen flex-col gap-6 border-r bg-white p-10 pr-6 text-base lg:relative',
        isOpen ? 'flex ' : 'hidden',
      )}
    >
      <div className="flex justify-end lg:hidden">
        <IconButton Icon={AiOutlineClose} onClick={close} />
      </div>
      <Link href="/" className="w-48 font-medium text-gray-600 hover:underline">
        홈
      </Link>
      <Link href="/" className="w-48 font-medium text-gray-600 hover:underline">
        태그
      </Link>
      <Link
        href="/category/web-devlopment"
        className="w-48 font-medium text-gray-600 hover:underline"
      >
        WEB DEV
      </Link>
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
      </div>
    </div>
  );
};

export default Sidebar;
