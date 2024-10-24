---
title: "TerraformでのAWS S3バケットへのアクセスエラーの解決法"
emoji: "⚠"
type: "tech"
topics: ["Terraform","AWS","S3"]
published: true
---

## TL;DR
AWS S3バケットへのアクセス時に発生する403 Forbiddenエラーの原因と解決策について解説します。

# TerraformでのAWS S3バケットへのアクセスエラーの解決法

AWSのS3バケットにおいて、Terraformを使用する際に「403 Forbidden」エラーが発生することがあります。このエラーは、アクセス許可の設定が原因であることが多いです。このブログ記事では、エラーを解決するための手順を詳しく解説します。

## エラーの概要

エラー内容:
```
Error: reading S3 Bucket (agrico-tfstate-bucket): operation error S3: HeadBucket, https response error StatusCode: 403, RequestID: 16RGTPNKNPSZ7YQJ, HostID: Sltqs7gTuadoVPqyNTwZKpa7/KvDUTGCx+dqWfcBFsmx8tipVKiLFiHfHVaSHQtuJtQviGi9rYnAW07xvufmbw==, api error Forbidden: Forbidden
```
このエラーは、Terraformが指定されたS3バケットにアクセスする際に、適切な権限がないために発生します。

## 解決策

以下の手順を確認し、必要に応じて設定を修正してください。

### 1. IAMポリシーの確認
- Terraformが使用しているIAMロールやユーザーに対して、以下のアクションが許可されていることを確認します:
  - `s3:ListBucket`
  - `s3:GetBucketLocation`
  - `s3:HeadBucket`

適切な権限がない場合は、IAMポリシーを修正し、`Allow`に設定してください。

### 2. バケットポリシーの確認
- S3バケットには独自のバケットポリシーが設定されています。バケットポリシーがTerraformの使用しているIAMロールやユーザーをブロックしている可能性があります。バケットポリシーを確認し、必要に応じて修正します。

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::ACCOUNT_ID:role/ROLE_NAME"
            },
            "Action": "s3:*",
            "Resource": "arn:aws:s3:::agrico-tfstate-bucket/*"
        }
    ]
}
```

### 3. バケットの名前の確認
- 指定しているバケット名（`agrico-tfstate-bucket`）が正しいかを確認します。タイプミスがあると、正しいバケットにアクセスできません。

### 4. リージョンの確認
- TerraformがAWSのS3バケットを操作する際に、適切なリージョンが設定されているか確認します。バケットが作成されたリージョンと、Terraformの設定に指定したリージョンが一致している必要があります。

### 5. AWS CLIやSDKでのテスト
- AWS CLIやSDKを使用して、同じIAMロールまたはユーザーの資格情報でS3バケットへのアクセスができるか確認します。以下のコマンドを実行してみてください:
```
aws s3 ls s3://agrico-tfstate-bucket
```
同様のエラーが出る場合は、上記の手順を再確認してください。

## まとめ

上記の手順を順番に確認し、修正を行った後、再度Terraformのコマンドを実行してみてください。これで問題が解決することを期待しています。