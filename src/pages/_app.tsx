import Footer from '@/components/Footer';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import '@/styles/globals.css';
import { cn } from '@/utils/style';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { useState } from 'react';

const queryClient = new QueryClient();

const inter = Inter({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={cn('flex h-screen w-screen lg:text-base', inter.className)}
      >
        <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
        <div className="flex flex-1 flex-col">
          <Header
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
          />
          {/* 해더가 포지션 픽스드의 역할처럼 될 수 있게 해주는 플렉스컨테이너이자 아이템 */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <main className="flex-1">
              <Component {...pageProps} />
            </main>
            <Footer />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}
