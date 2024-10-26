# zenn-maker
## TL;DR
この記事・動画をご覧ください
[Zenn](https://zenn.dev/masuda1112/articles/2024-10-25-zenn-maker)
[YouTube](https://youtu.be/USWBTOucO80)

## 用意するもの
- Zennのアカウント
- GitHubのアカウント
- OpenAIのアカウント（APIキーが必要です）

## 事前準備

### 1. ZennをGitHubと連携させる
[この記事](https://zenn.dev/zenn/articles/connect-to-github)を参考に、ZennとGitHubを連携させます。  
レポジトリ名は、できれば`zenn`にしておいてください。

### 2. GitHubアプリを作成
次に、GitHubのAppsを作成します。作成したアプリをフォークしたレポジトリや、Zennに記事を保存するレポジトリにインストールしてください。  
詳細は[こちらの記事](https://zenn.dev/suzutan/articles/how-to-use-github-apps-token-in-github-actions)を参考に設定します。

### 3. GitHub Secretsと環境変数の設定
GitHubに以下の環境変数とSecretsを設定します。

#### Secrets
- `APP_ID`: GitHub AppのID
- `PRIVATE_KEY`: GitHub Appのプライベートキー
![](/images/zenn-maker/github-0.png)
#### 環境変数
- `DESTINATION_REPO`: Zennの記事を保存しているレポジトリ（例: `Masuda-1246/zenn`）
- `DESTINATION_REPO_BASE_BRANCH`: ベースブランチ（例: `main`）
- `DESTINATION_REPO_HEAD_BRANCH`: ヘッドブランチ（例: `zenn-maker`）
![](/images/zenn-maker/github-1.png)

## セットアップ方法

1. このリポジトリをフォーク
2. フォークしたリポジトリをローカルにクローン
3. `npm install`を実行
4. `.envrc.example`を参考に環境変数を設定
   - `OPENAI_API_KEY`: OpenAIのAPIキー
   - `OPENAI_MODEL`: 使用するOpenAIモデル（例: `gpt-3.5-turbo-0125`）
5. `npm run dev`を実行

## 使い方

1. [localhost:3000](http://localhost:3000) にアクセスします。
   ![](/images/zenn-maker/zenn-maker-0.png)

2. 調べたいことやエラー内容をテキストエリアに入力し、`Send`ボタン（またはCtrl + Enter）をクリックします。
   ![](/images/zenn-maker/zenn-maker-1.png)

3. AIが回答を生成しますので、少し待ちます。
   ![](/images/zenn-maker/zenn-maker-2.png)

4. 問題が解決したら、`Generate Blog Post`ボタンをクリック。
5. ファイル名を入力し、`Generate`ボタンをクリック。
   ![](/images/zenn-maker/zenn-maker-3.png)

6. しばらく待つと、記事が生成されます。
   ![](/images/zenn-maker/zenn-maker-4.png)

7. 記事が気に入ったら、`Save Blog Post`ボタンをクリック。
8. 記事が`data/articles`に保存されます。
   ![](/images/zenn-maker/zenn-maker-5.png)

9. `git push`を実行。
10. Zennの保存先レポジトリにPRが自動で作成されます。
    ![](/images/zenn-maker/zenn-maker-6.png)

11. PRをマージすると、記事が公開されます。
    ![](/images/zenn-maker/zenn-maker-7.png)

## 構成技術
- Next.js
- OpenAI
- GitHub Actions
- V0
