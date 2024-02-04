// 미들웨어는 모든 요청을 한번 거쳐가는 작업을 할 수 있게 해준다.
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { createClient } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.role !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return response;
}

// write로 들어갔을때 미들웨어 실행
export const config = {
  matcher: '/write',
};
