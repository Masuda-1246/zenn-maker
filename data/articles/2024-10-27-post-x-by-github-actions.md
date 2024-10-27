---
title: "GitHub ActionsでTwitterに記事を投稿する自動化スクリプト"
emoji: "🚀"
type: "tech"
topics: ["GitHub Actions","Twitter API","Python"]
published: true
---

## TL;DR
GitHub Actionsを利用して、特定のMarkdownファイルが更新された際に自動でTwitterに投稿するスクリプトを作成する方法について解説します。

## GitHub ActionsでTwitterに記事を投稿する自動化スクリプト

この記事では、GitHub Actionsを使用して、特定のMarkdownファイルが変更された時に自動でTwitter（X）に投稿するスクリプトの構成と注意点、改善点について詳しく解説します。
この記事は以下の二つの続きのような記事です。
https://zenn.dev/masuda1112/articles/2024-10-25-zenn-maker
https://zenn.dev/masuda1112/articles/2024-10-26-craete-post-by-python

参考までに自分のGitHubのレポジトリです。
https://github.com/Masuda-1246/zenn

## スクリプトの概要

以下のPythonスクリプトは、OAuth 1.0aを利用してTwitterに投稿を行います。GitHub Actionsからトリガーされ、`articles`ディレクトリ内のMarkdownファイルの変更を監視します。

```python
import os
import requests
from requests_oauthlib import OAuth1

# OAuth 1.0a 認証の設定
auth = OAuth1(
    os.getenv("API_KEY"),
    os.getenv("API_SECRET_KEY"),
    os.getenv("ACCESS_TOKEN"),
    os.getenv("ACCESS_TOKEN_SECRET")
)

# 各投稿内容を環境変数から取得してツイート
for key, value in os.environ.items():
    if key.startswith("TWEET_CONTENT_"):
        # 投稿内容からタイトルとURL、トピックタグを取得
        page_title = key.split("TWEET_CONTENT_")[-1]
        tweet_content = value
        url = os.getenv(f"URL_{page_title}")
        topics = os.getenv(f"TOPICS_{page_title}")

        # トピックをタグ形式に変換
        tags = " ".join([f"#{topic.strip()}" for topic in topics.split(",")]) if topics else ""

        # タイトルにリンクを埋め込んだ投稿内容をフォーマット
        tweet_text = f"{tweet_content}\n\n{url}\n\n{tags}"

        # API エンドポイント
        api_url = "https://api.twitter.com/2/tweets"
        payload = {"text": tweet_text}

        # POSTリクエストを送信
        response = requests.post(api_url, auth=auth, json=payload)

        if response.status_code == 201:
            print(f"Successfully posted to X: {tweet_text}")
        else:
            print(f"Failed to post to X: {response.status_code}")
            print(response.json())
```

## GitHub Actionsの設定

以下のように、GitHub Actionsのworkflowを設定します。これにより、`articles/*.md`ファイルが更新された際に自動でスクリプトが実行されます。

```yaml
name: Post updated articles to X

on:
  push:
    paths:
      - "articles/*.md"  # articlesディレクトリ内の.mdファイルの変更をトリガー

jobs:
  post_to_x:
    runs-on: ubuntu-latest

    steps:
      - name: Check out the code
        uses: actions/checkout@v2
        with:
          fetch-depth: 2  # 直近の2つのコミットを取得して差分を比較

      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.x'

      - name: Install dependencies
        run: pip install requests requests-oauthlib

      - name: Extract titles, URLs, and topics from updated articles
        id: extract_posts
        run: |
          UPDATED_FILES=$(git diff --name-only HEAD^ HEAD | grep '^articles/.*\.md')
          
          for FILE in $UPDATED_FILES; do
            # ファイル名から拡張子.mdを除去してpage-titleを生成
            PAGE_TITLE=$(basename "$FILE" .md)
            URL="${{ secrets.BASE_URL }}/$PAGE_TITLE"
            
            # titleのフィールドを抽出
            TITLE=$(grep '^title:' "$FILE" | sed 's/title: \"(.*)\"/\1/')

            # topicsのフィールドを抽出
            TOPICS=$(grep '^topics:' "$FILE" | sed 's/topics: \[\(.*\)\]/\1/' | sed 's/\"//g')

            # 投稿内容とURL、トピックを環境変数に設定
            echo "TWEET_CONTENT_$PAGE_TITLE=${TITLE}という記事を作成しました！" >> $GITHUB_ENV
            echo "URL_$PAGE_TITLE=$URL" >> $GITHUB_ENV
            echo "TOPICS_$PAGE_TITLE=$TOPICS" >> $GITHUB_ENV
          done

      - name: Run Python script to post to X
        env:
          API_KEY: ${{ secrets.API_KEY }}
          API_SECRET_KEY: ${{ secrets.API_SECRET_KEY }}
          ACCESS_TOKEN: ${{ secrets.ACCESS_TOKEN }}
          ACCESS_TOKEN_SECRET: ${{ secrets.ACCESS_TOKEN_SECRET }}
        run: python post_to_x.py
```

## 注意点と改善点

- **ファイルのフォーマット**: 記事ファイルが正しい形式であることを確認することが重要です。
- **環境変数の管理**: 環境変数の命名規則を工夫し、衝突を避けることが望ましいです。
- **エラーハンドリング**: APIのレスポンスを詳細にログ出力し、問題の特定を容易にします。
- **レート制限への配慮**: Twitter APIのレート制限に注意し、ツイートの頻度調整を考慮しましょう。
- **セキュリティの確保**: APIキーやトークンの管理は常に注意が必要です。

## まとめ

GitHub Actionsを利用した自動化スクリプトは、ブログ更新の効率を大幅に向上させることができます。上記のポイントを踏まえながら、さらに改善を進めていくことで、より強力なツールを構築していくことができるでしょう。