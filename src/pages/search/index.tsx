import IconButton from '@/components/IconButton';
import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { ChatCompletionMessageParam } from 'openai/resources/index';
import { FormEvent, useCallback, useRef, useState } from 'react';
import { FaMessage } from 'react-icons/fa6';

export default function Search() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [messageParams, setMessageParams] = useState<
    ChatCompletionMessageParam[]
  >([]);

  const { mutate, isPending } = useMutation<
    ChatCompletionMessageParam[],
    unknown,
    ChatCompletionMessageParam[]
  >({
    mutationFn: async (messages) => {
      const res = await axios.post('/api/completions', { messages });
      return res.data.messages;
    },
    onSuccess: (data) => {
      setMessageParams(data);
      if (inputRef.current) {
        inputRef.current.value = '';
      }
    },
  });

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e?.preventDefault();
      if (isPending) return;
      const nextMessages = [
        ...messageParams,
        {
          content: inputRef.current?.value ?? ('' as string),
          role: 'user' as const,
        },
      ];
      setMessageParams(nextMessages);
      mutate(nextMessages);
    },
    [isPending, messageParams, mutate],
  );
  return (
    <div className="flex flex-1 flex-col">
      <div className="flex-1">{JSON.stringify(messageParams)}</div>
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
        </form>
      </div>
    </div>
  );
}
