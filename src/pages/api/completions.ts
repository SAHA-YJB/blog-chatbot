import { createClient } from '@/utils/supabase/server';
import { NextApiRequest, NextApiResponse } from 'next';
import OpenAi from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionSystemMessageParam,
} from 'openai/resources/index.mjs';

// OpenAI API 클라이언트를 생성
const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

// API 응답의 타입을 정의
// open ai api의타입
type CompletionsResponse = {
  messages: ChatCompletionMessageParam[];
};

// 첫 번째 메시지를 가져오는 함수 Supabase 클라이언트를 인자로 받음
// ReturnType<typeof createClient>
// 이 매개변수의 타입은 createClient 함수의 반환 타입
// ReturnType은 TypeScript의 내장 유틸리티 타입 중 하나로,
// 특정 함수의 반환 타입을 추출
// createClient 함수의 반환 타입이 supabase 매개변수의 타입
// createClient 함수는 supabase client 객체를 생성하여 반환하는 함수라고 생각
const getFirstMessage = async (
  supabase: ReturnType<typeof createClient>,
): Promise<ChatCompletionSystemMessageParam> => {
  const { data: postMetadataList } = await supabase
    .from('Post')
    .select('id, title, category, tags');
  return {
    role: 'system',
    content: `너는 개발 전문 챗봇이야 모든 개발에 관한 너가 알고있는 지식을 활용하여 답변해줘야해
      그리고 여기 블로그에서도 참고할수 있는것은 가져와서 답변해줘 
      블로그 글 목록: ${JSON.stringify(postMetadataList ?? [])}
      `,
  };
};

// 블로그 포스트를 가져오는 함수 포스트의 id와 Supabase 클라이언트를 인자로 받음
const getBlogPost = async (
  id: string,
  supabase: ReturnType<typeof createClient>,
) => {
  // 아이디를 이용하여 포스트를 가져옴
  const { data: post } = await supabase
    .from('Post')
    .select('content')
    .eq('id', id);
  return post?.[0]?.content ?? [];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompletionsResponse>,
) {
  // 요청 메서드가 GET이 아니라면 405(Method Not Allowed) 상태 코드를 반환하고 함수를 종료
  if (req.method !== 'POST') {
    res.status(405).end();
    return;
  }

  // 메시지를 저장할 배열을 생성
  const messages = req.body.messages as ChatCompletionMessageParam[];
  // Supabase 클라이언트를 생성
  // 요청 헤더에 저장된 쿠키를 사용하여 인증된 사용자의 정보를 가져옴
  const supabase = await createClient(req.cookies);

  // 메시지가 없다면 첫 번째 메시지를 가져와 배열에 추가
  if (messages.length === 1) {
    messages.unshift(await getFirstMessage(supabase));
  }

  // 마지막 메시지의 역할이 'assistant'가 아닐 때까지 반복
  while (messages.at(-1)?.role !== 'assistant') {
    // OpenAI API를 이용하여 대화를 생성합
    const response = await openai.chat.completions.create({
      messages,
      // 사용할 모델을 지정
      model: 'gpt-4-1106-preview',
      function_call: 'auto',
      functions: [
        {
          name: 'retrieve',
          parameters: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: '가져온 데이터의 id',
              },
            },
          },
        },
      ],
    });

    // API 응답에서 메시지를 가져옵니다.
    const responseMessage = response.choices[0].message;

    if (responseMessage.function_call) {
      // 함수 호출의 인자에서 id를 가져와 getBlogPost 함수를 호출하여 블로그 포스트를 가져옴
      const { id } = JSON.parse(responseMessage.function_call.arguments);
      const fucResult = await getBlogPost(id, supabase);

      // 메시지 배열에 함수 결과를 추가
      messages.push({
        role: 'function',
        content: JSON.stringify(fucResult),
        name: responseMessage.function_call.name,
      });
    } else {
      messages.push(responseMessage);
    }
  }

  res.status(200).json({ messages });
}
