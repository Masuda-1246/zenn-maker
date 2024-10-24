---
title: "ターミナルでファイル内容をクリップボードにコピーする方法"
emoji: "🛠"
type: "tech"
topics: ["ターミナル","クリップボード","OS別コマンド"]
published: true
---

## TL;DR
この記事では、ターミナルを使用してファイルの中身をクリップボードにコピーする方法をOS別に解説します。

## ターミナルでファイルの中身をクリップボードにコピーする方法

ターミナルでファイルの中身をクリップボードにコピーする方法は、使用しているOSによって異なります。以下は、各OSでの方法です。

### macOS
macOSでは、`pbcopy`コマンドを使用します。`test.py`の中身をクリップボードにコピーするには、以下のコマンドを実行します。

```bash
cat test.py | pbcopy
```

または、次のように直接ファイルを指定することもできます。

```bash
pbcopy < test.py
```

### Linux
Linuxでは、`xclip`または`xsel`を使います。セットアップされているか確認し、次のコマンドを使用します。

#### `xclip`を使う場合:

```bash
cat test.py | xclip -selection clipboard
```

#### `xsel`を使う場合:

```bash
cat test.py | xsel --clipboard
```

### Windows
WindowsのコマンドプロンプトやPowerShellでは、`clip`コマンドを使用します。PowerShellの場合は次のようにします。

```powershell
Get-Content test.py | clip
```

または、コマンドプロンプトの場合は次のようにします。

```cmd
type test.py | clip
```

これで、`test.py`の中身がクリップボードにコピーされます。ご利用のシステムに合わせて適切な方法を選んでください。