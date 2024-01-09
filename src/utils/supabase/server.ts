// pages라우터는 cookies함수가 없음
// 유저의 정보를 주입받기 위해 쿠키를 사용함
// 마이그레이션 시 cookies함수가 사용
import { Database } from '@/types/supabase';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
// import { cookies } from 'next/headers';

export const createClient = (
  cookies: Partial<{
    [key: string]: string;
  }>,
) => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies[name];
        },
      },
    },
  );
};
