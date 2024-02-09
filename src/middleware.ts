// 미들웨어는 모든 요청이 서버에 도달하기 전에 처리되는 함수
// 이를 통해 요청을 검사하거나 수정하거나, 특정 작업을 수행
import { NextRequest, NextResponse } from 'next/server';
import React from 'react';
import { createClient } from './utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { supabase, response } = createClient(request);

  // 현재 유저 정보를 가져옴
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 사용자의 역할이 'authenticated'가 아니라면 '/admin' 페이지로 리다이렉션
  if (user?.role !== 'authenticated') {
    return NextResponse.redirect(new URL('/admin', request.url));
  }
  return response;
}

// write로 들어갔을때 미들웨어 실행
export const config = {
  matcher: '/write',
};
