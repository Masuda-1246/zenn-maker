// app/api/saveBlog/route.ts

export const runtime = 'nodejs'; // Node.js ランタイムを指定

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(request: Request) {
  try {
    const { blogTitle, blogContent }: { blogTitle: string; blogContent: string } = await request.json();

    // 保存先ディレクトリ
    const dir = path.join(process.cwd(), 'data', 'articles');

    // ディレクトリを作成（存在しない場合のみ）
    await fs.mkdir(dir, { recursive: true });

    const today = new Date();
    const date = today.toISOString().split('T')[0];

    // ファイルパス
    const filePath = path.join(dir, `${date}-${blogTitle}.md`);

    // ファイルに書き込み
    await fs.writeFile(filePath, blogContent);

    return NextResponse.json({ message: 'ブログ記事が保存されました' });
  } catch (error) {
    console.error('ブログ記事の保存に失敗しました:', error);
    return NextResponse.json(
      { error: 'ブログ記事の保存に失敗しました' },
      { status: 500 }
    );
  }
}
