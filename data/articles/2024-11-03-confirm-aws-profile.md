---
title: "AWSプロファイルの管理とTerraformでの指定方法"
emoji: "🛠"
type: "tech"
topics: ["AWS","CLI","Terraform"]
published: true
---

## TL;DR
AWS CLIを使用してプロファイルの確認、デフォルト設定、Terraformでのプロファイル指定方法を解説します。

# AWSプロファイルの管理とTerraformでの指定方法

AWS CLIを使用して現在のプロファイルやデバイスに登録されているプロファイルを確認し、デフォルトを設定し直し、Terraformで指定する方法について説明します。

## 1. 現在使っているAWSプロファイルの確認

現在使用しているプロファイルを確認するには、次のコマンドを実行してください。

```bash
aws configure list
```

これにより、使用中のプロファイルの情報（アクセスキー、シークレットキー、リージョンなど）が表示されます。現在のプロファイルは`AWS_PROFILE`環境変数からも確認できます。

```bash
echo $AWS_PROFILE
```

もしこの環境変数が設定されていない場合は、デフォルトプロファイルが使用されていることになります。

## 2. デバイスに登録されているプロファイルの一覧出力

AWS CLIで設定されたプロファイルを一覧で表示するには、以下のコマンドを使います。

```bash
cat ~/.aws/config
cat ~/.aws/credentials
```

このコマンドを実行することで、設定済みのすべてのプロファイルが表示されます。

## 3. デフォルトプロファイルを設定し直す

デフォルトプロファイルを設定し直すには、`~/.aws/config`や`~/.aws/credentials`ファイルを直接編集することができます。必要なプロファイルをデフォルトとして設定する場合は、次のようにします。

具体的には、`~/.aws/config`ファイルで`[default]`セクションを作成または変更することでデフォルトプロファイルを設定できます。

```ini
[default]
region = us-east-1
output = json
```

もしくは、AWS CLIの`configure`コマンドで設定することも可能です。

```bash
aws configure --profile default
```

## 4. Terraformでプロファイルを指定する方法

Terraformで特定のAWSプロファイルを指定するには、プロバイダーの設定で`profile`属性を使用します。以下のように`main.tf`や適切なTerraformファイル内で設定します。

```hcl
provider "aws" {
  region  = "us-east-1"
  profile = "your_profile_name"  # 使用するプロファイル名
}
```

これにより、指定したAWSプロファイルがTerraformによって使用されるようになります。

以上の手順に従えば、AWSプロファイルの管理やTerraformでのプロファイル指定が可能です。他に質問があればお知らせください。