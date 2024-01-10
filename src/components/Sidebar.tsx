import { cn } from '@/utils/style';
import Link from 'next/link';
import React, { FC } from 'react';
import { AiFillGithub, AiFillFileText, AiOutlineClose } from 'react-icons/ai';

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
        <AiOutlineClose onClick={close} className="h-5 w-5" />
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
        <Link href="https://s-aha-dev.tistory.com" target="_blank">
          <AiFillFileText className="h-6 w-6" />
        </Link>
        <Link href="https://github.com/SAHA-YJB" target="_blank">
          <AiFillGithub className="h-6 w-6" />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
