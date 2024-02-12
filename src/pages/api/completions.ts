import { NextApiRequest, NextApiResponse } from 'next';
import OpenAi from 'openai';
import {
  ChatCompletionMessageParam,
  ChatCompletionMessage,
} from 'openai/resources/index.mjs';

const openai = new OpenAi({ apiKey: process.env.OPENAI_API_KEY });

type CompletionsResponse = {
  messages: ChatCompletionMessage[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CompletionsResponse>,
) {
  if (req.method !== 'GET') {
    res.status(405).end();
    return;
  }

  const messages: ChatCompletionMessage[] = [];

  const response = await openai.chat.completions.create({
    messages: [
      {
        role: 'system',
        content: '다 알고 있는 너는 나만의 챗봇',
      },
    ],
    model: 'gpt-4-0613',
  });

  console.log(response);
  messages.push(response.choices[0].message);

  res.status(200).json({ messages });
}
