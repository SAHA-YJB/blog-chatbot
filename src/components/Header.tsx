import Link from 'next/link';
import { Dispatch, FC, SetStateAction } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { BsRobot } from 'react-icons/bs';

interface HeaderProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: Dispatch<SetStateAction<boolean>>;
}

const Header: FC<HeaderProps> = ({ setIsSidebarOpen, isSidebarOpen }) => {
  return (
    <header className="flex h-16 items-center justify-between border-b px-4 lg:h-20 lg:px-10">
      <button
        className="p-2"
        onClick={() => setIsSidebarOpen((toggle) => !toggle)}
      >
        {isSidebarOpen ? (
          <AiOutlineClose className="h-5 w-5 lg:h-6 lg:w-6" />
        ) : (
          <AiOutlineMenu className="h-5 w-5 lg:h-6 lg:w-6" />
        )}
      </button>
      <Link href="/">
        <h1 className="text-3xl font-medium text-slate-600 lg:text-4xl">
          SAHA
        </h1>
      </Link>
      <Link href="/posts" className="p-2">
        <BsRobot className="h-5 w-5 lg:h-6 lg:w-6" />
      </Link>
    </header>
  );
};

export default Header;