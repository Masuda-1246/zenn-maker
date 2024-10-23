// app/api/generateBlog/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { z } from 'zod';

// 型定義
const MessageSchema = z.object({
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string(),
});

const RequestSchema = z.object({
  messages: z.array(MessageSchema),
  title: z.string().optional(),
});

// ブログ記事のフォーマット用の型
interface BlogFormat {
  title: string;
  emoji: string;
  topics: string[];
  content: string;
  tldr: string;
}

export async function POST(request: Request) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  try {
    // リクエストの検証
    const body = await request.json();
    const validatedData = RequestSchema.parse(body);

    // システムプロンプトの定義
    const systemPrompt: OpenAI.Chat.ChatCompletionMessageParam = {
      role: 'system',
      content: `あなたは技術ブログの記事を生成する専門家です。
与えられた会話内容から、技術的な問題と解決策を分析したり、わかりやすい技術ブログ記事を作成してください。
会話の中で出てくるシークレットな情報や個人情報は含めないでください。
記事は JSON 形式で返してください。`,
    };

    // ユーザーの会話履歴を整形
    const conversationContext = validatedData.messages
      .map(msg => `${msg.role === 'user' ? 'Q' : 'A'}: ${msg.content}`)
      .join('\n');

    // 記事生成用のプロンプト
    const userPrompt: OpenAI.Chat.ChatCompletionMessageParam = {
      role: 'user',
      content: `以下の会話内容から技術ブログ記事を生成してください:

${conversationContext}

以下の JSON 形式で記事を生成してください:
{
  "title": "記事のタイトル",
  "emoji": "記事を表す絵文字を次の中から1つ(🚀, 📝, 🎉, 📦, 🎨, 🛠, 📚, 🧠, 🤖, 🧪, 🤗, 🤭, 🤫, 🤔, ⚠, 😠, 💣)"
  "topics": ["関連するトピック（技術名）を3つまで"],
  "tldr": "記事の要約を1〜2文で",
  "content": "記事の本文をMarkdown形式で"
}`,
    };

    // ChatGPT APIを呼び出し
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL!,
      messages: [systemPrompt, userPrompt],
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const rawResponse = completion.choices[0]?.message?.content;
    if (!rawResponse) {
      throw new Error('APIからの応答が空です');
    }

    // JSONをパース
    const blogData = JSON.parse(rawResponse) as BlogFormat;

    // Zennの記事フォーマットに変換
    const zennFormat = `---
title: "${blogData.title}"
emoji: "${blogData.emoji}"
type: "tech"
topics: ${JSON.stringify(blogData.topics)}
published: true
---

## TL;DR
${blogData.tldr}

${blogData.content}`;

    return NextResponse.json({ content: zennFormat });

  } catch (error) {
    console.error('ブログ記事の生成に失敗しました:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'リクエストの形式が正しくありません', details: error.issues },
        { status: 400 }
      );
    }

    if (error instanceof OpenAI.APIError) {
      return NextResponse.json(
        { error: 'OpenAI APIでエラーが発生しました', details: error.message },
        { status: 502 }
      );
    }

    return NextResponse.json(
      { error: 'ブログ記事の生成に失敗しました' },
      { status: 500 }
    );
  }
}