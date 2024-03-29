import IconButton from '@/components/IconButton';
import Message, { MessageProps } from '@/components/Message';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { FormEvent, useCallback, useMemo, useRef, useState } from 'react';
import { FaMessage } from 'react-icons/fa6';
import { FaRegTrashAlt } from 'react-icons/fa';

const SearchPage = () => {
  const inputRef = useRef<HTMLInputElement>(null);
  // messageParams 상태를 설정
  // 초기값은 로컬 스토리지에 저장된 메시지
  // 로컬 스토리지에서 메시지를 불러오는 로직
  // 서버 사이드 렌더링 환경을 고려하여 window 객체의 존재 여부를 확인
  const [messageParams, setMessageParams] = useState<
    ChatCompletionMessageParam[]
  >(() => {
    if (typeof window === 'undefined') return [];
    const existingMessages = localStorage.getItem('messages');
    if (!existingMessages) return [];
    return JSON.parse(existingMessages);
  });

  // mutate 함수를 통해 메시지를 전송하고 결과를 처리
  const { mutate, isPending } = useMutation<
    ChatCompletionMessageParam[],
    unknown,
    ChatCompletionMessageParam[]
  >({
    mutationFn: async (messages) => {
      const res = await axios.post('/api/completions', { messages });
      return res.data.messages;
    },
    // API 호출이 성공하면 메시지를 설정하고 로컬 스토리지에 저장
    // 제이슨 형태로 저장
    onSuccess: (data) => {
      setMessageParams(data);
      localStorage.setItem('messages', JSON.stringify(data));
    },
  });

  // 대화를 초기화하는 함수
  const handleReset = useCallback(() => {
    if (window.confirm('정말로 대화를 초기화할까요?')) {
      setMessageParams([]);
      localStorage.removeItem('messages');
    }
  }, []);

  // 폼 제출 시 입력값을 처리하는 함수
  // 입력값이 없거나 통신 중인 경우를 처리
  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (isPending || !inputRef.current) return;
      const nextMessages = [
        ...messageParams,
        {
          content: inputRef.current?.value ?? ('' as string),
          role: 'user' as const,
        },
      ];
      setMessageParams(nextMessages);
      mutate(nextMessages);
      inputRef.current.value = '';
    },
    [isPending, messageParams, mutate],
  );

  // 메시지 목록을 생성하는 로직
  // 여기서는 필터링된 메시지를 메시지 컴포넌트의 prop으로 전달
  const messagePropsList = useMemo(() => {
    return messageParams.filter(
      (param): param is MessageProps =>
        param.role === 'assistant' || param.role === 'user',
    );
  }, [messageParams]);

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">
        <Message content="안녕하세요! 무엇을 도와드릴까요?" role="assistant" />
        {messagePropsList.map((props, index) => (
          <Message {...props} key={index} />
        ))}
        {isPending && (
          <Message
            content="열심히 생각하고 답변을 준비하고 있어요..."
            role="assistant"
          />
        )}
      </div>
      <div className="container mx-auto p-4 pb-12">
        <form
          onSubmit={handleSubmit}
          className="flex items-center rounded-md border"
        >
          <input
            type="text"
            ref={inputRef}
            className="flex-1 rounded-md p-2 pl-3"
            placeholder="Grow Up"
          />
          <IconButton Icon={FaMessage} type="submit" />
          <IconButton
            Icon={FaRegTrashAlt}
            type="button"
            handleReset={handleReset}
          />
        </form>
      </div>
    </div>
  );
};
export default SearchPage;
