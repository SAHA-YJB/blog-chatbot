import Button from '@/components/Button';
import Input from '@/components/Input';
import { createClient } from '@/utils/supabase/client';
import { UserResponse } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const supabase = createClient();

export default function Admin() {
  const router = useRouter();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  // 사용자 정보 저장 스테이트
  const [userResponse, setUserResponse] = useState<UserResponse>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // 입력된 이메일과 비밀번호로 로그인을 시도
    const response = await supabase.auth.signInWithPassword({
      email: emailRef.current?.value ?? '',
      password: passwordRef.current?.value ?? '',
    });

    if (!response.data.user) {
      return alert('로그인에 실패했습니다.');
    }
    router.refresh();
  };

  // 라우터 리프레시가 되고 난후 유저의 상태 변경
  useEffect(() => {
    // async의 리턴은 항상 Promise
    // useEffect는 클린업 함수로 다른 리턴값이 있음
    // 프로미스가 리턴되면 리액트 입장에서는 어떤 버그가 나올지 모름
    // 밑의 방식으로 비동기 처리
    // 비동기 함수를 실행하여 현재 로그인한 사용자의 정보를 가져옴
    (async () => {
      const user = await supabase.auth.getUser();
      setUserResponse(user);
    })();
  }, []);
  // 의존성 배열에 빈 배열을 넣어주면 컴포넌트가 마운트 될 때 한번만 실행됨

  return (
    <div className="container flex flex-col pb-20 pt-12">
      {!!userResponse?.data.user ? (
        <div className="flex flex-col gap-2">
          <div className="mb-8">
            <b>{userResponse.data.user.email}</b>님으로 로그인 하셨습니다.
          </div>
          <Button type="button" onClick={() => router.push('/write')}>
            글 쓰러 가기
          </Button>

          <Button
            type="button"
            className="w-full rounded-md bg-gray-800 py-2 text-white"
            onClick={async () => {
              supabase.auth.signOut();
              router.push('/');
            }}
          >
            로그아웃
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          <h1 className="text-2xl font-medium">관리자 로그인</h1>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <Input type="text" placeholder="이메일" ref={emailRef} />
              <Input type="password" placeholder="비밀번호" ref={passwordRef} />
            </div>
            <Button type="submit" className="mt-4">
              관리자 로그인
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}
