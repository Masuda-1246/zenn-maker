---
title: "GitHubでのパスワード認証一時無効化エラーの対処法"
emoji: "🔒"
type: "tech"
topics: ["Git","GitHub","認証"]
published: false
---

## TL;DR
GitHubでのパスワード認証が一時的に無効化され、代わりにパーソナルアクセストークンを使用する必要がある際に発生するエラーについて解説します。

## GitHubでのパスワード認証一時無効化エラーの対処法

最近、GitHubでのパスワード認証が一時的に無効化され、代わりにパーソナルアクセストークン（Personal Access Token）の使用が求められるようになりました。この変更により、従来の方法でリモートリポジトリにプッシュしようとすると、以下のようなエラーが発生することがあります。

```
remote: Password authentication is temporarily disabled as part of a brownout. Please use a personal access token instead.
remote: Please see https://github.blog/2020-07-30-token-authentication-requirements-for-api-and-git-operations/ for more information.
fatal: unable to access 'https://github.com/ユーザー名/リポジトリ名.git/': The requested URL returned error: 403
```

このエラーメッセージは、パスワード認証の一時無効化に関するものです。GitHubのポリシーに従い、アカウントでパーソナルアクセストークンを生成し、そのトークンを使用して操作を行う必要があります。

対処法は以下の通りです：

1. GitHubのアカウントにログインし、[Settings]を開きます。
2. [Developer settings]から[Personal access tokens]を選択し、[Generate new token]をクリックします。
3. トークンには適切なスコープ（権限）を付与し、生成後に表示されるトークンを安全な場所に保存します。
4. ローカルでの操作時には、通常のパスワードの代わりにこのパーソナルアクセストークンを使用します。

これでエラーが解消され、再びリモートリポジトリへのプッシュ操作が可能になります。GitHubの新しい認証方法に適応しましょう！