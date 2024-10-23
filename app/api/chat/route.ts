// app/api/chat/route.ts

import { NextResponse } from 'next/server';
import OpenAI from 'openai'; // OpenAI をデフォルトインポート

// メッセージの型定義
interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!, // 環境変数の API キーを指定
  });

  try {
    const { messages }: { messages: Message[] } = await request.json();

    const systemMessage: Message = {
      role: 'system',
      content: 'あなたは熟練のエンジニアです。質問に対して答えてください。',
    };

    // システムメッセージを先頭に追加
    const messagesWitmessageshSystem = [systemMessage, ...messages];

    // ChatGPT API の呼び出し
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: messagesWitmessageshSystem,
    });

    const reply = completion.choices[0].message.content;

    return NextResponse.json({ reply });
  } catch (error: unknown) {
    console.error('API 呼び出しに失敗しました:', error);
    return NextResponse.json(
      { error: 'ChatGPT API の呼び出しに失敗しました' },
      { status: 500 }
    );
  }
}
