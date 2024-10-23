---
title: "GitHub ActionsでのPermissionエラー解決ガイド"
emoji: "⚠"
type: "tech"
topics: ["GitHub Actions","CI/CD","Git"]
published: false
---

## TL;DR
GitHub Actionsで`git push`を実行した際に発生するPermissionエラーの原因と解決策を解説します。

# GitHub ActionsでのPermissionエラー解決ガイド

GitHub Actionsを使用してリポジトリにコードをプッシュしようとしたときに、以下のようなエラーメッセージが表示されることがあります。

```
git push origin main
remote: Permission to [リポジトリ名] denied to github-actions[bot].
fatal: unable to access 'https://github.com/[リポジトリ名]/': The requested URL returned error: 403
Error: Process completed with exit code 128.
```

このエラーは、GitHub Actionsの実行中に必要な権限が不足しているために発生します。以下に、問題を解決するためのいくつかのポイントを紹介します。

## 1. 適切なトークンを使用しているか確認
`tibdex/github-app-token@v2`を使って生成したトークン (`API_TOKEN_GITHUB`) が、PushやPull Requestの作成に十分な権限を持っているか確認してください。
- `repo` 権限（リポジトリへのフルアクセス）
- 必要に応じて `write` 権限も必要です

## 2. GitHub Actionsの設定確認
リポジトリの「Settings」→「Actions」→「General」セクションで、GitHub Actionsの実行に必要な権限が適切に設定されているか確認してください。特に以下のオプションが有効になっていることを確認します。
- 「Allow GitHub Actions to create and approve pull requests」
- 「Allow GitHub Actions to push to the repository」

## 3. ブランチ保護ルールの確認
`main`ブランチが保護されている場合、特に「押し込みが制限されている」設定になっていると、GitHub Actionsから直接プッシュできません。この場合は保護ルールの設定を見直すか、別のブランチを経由してのプッシュを検討してください。

## 4. ユーザー名とメールアドレスの設定
`git config --global user.email`や`git config --global user.name`で設定されているユーザーが、GitHub Actionsからのpushを許可されているか確認します。

## 5. 実行環境の確認
GitHub Actionsの実行環境がLinux (`ubuntu-latest`) であることを確認し、他のバージョンや環境で実行した場合の影響を考慮します。

これらのポイントを確認し、設定を見直した後再度スクリプトを実行してみてください。それでも問題が解決しない場合は、具体的なリポジトリや設定の情報を基に再検討する必要があります。