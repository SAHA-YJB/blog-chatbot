import { NextApiRequest, NextApiResponse } from 'next';
import OpenAi from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

// API 응답의 타입을 정의
type CompletionsResponse = {
  messages: ChatCompletionMessageParam[];
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

  // OpenAI API를 이용하여 대화를 생성합
  const response = await openai.chat.completions.create({
    messages,
    // 사용할 모델을 지정
    model: 'gpt-4-0613',
  });

  console.log(response);
  messages.push(response.choices[0].message);

  res.status(200).json({ messages });
}
