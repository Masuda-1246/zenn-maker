---
title: "Node.jsでPCの操作を自動化する方法"
emoji: "🛠"
type: "tech"
topics: ["Node.js","自動化","robotjs"]
published: true
---

## TL;DR
Node.jsを使用してPCのカーソル移動、マウスクリック、キーボード入力を自動化する方法を解説します。

# Node.jsでPCの操作を自動化する方法

Node.jsを使用してPCの操作（カーソル移動、マウスクリック、キーボード入力）を行うためには、外部ライブラリを利用するのが一般的です。ここでは、`robotjs`と`nut.js`という2つのライブラリを使った方法を紹介します。

## 1. `robotjs`ライブラリを使う

`robotjs`はNode.js用の高機能な自動化ライブラリで、マウスとキーボードの操作を行うことができます。

### インストール

以下のコマンドで、`robotjs`をインストールします。

```bash
npm install robotjs
```

### 使用例

以下のコードは、マウスを移動し、クリックし、キーボードに入力する基本的な例です。

```javascript
const robot = require('robotjs');

// カーソルを指定の位置に移動
robot.moveMouse(100, 100);

// マウスの左ボタンをクリック
robot.mouseClick();

// キーボードに「Hello, World!」と入力
robot.typeString("Hello, World!");
```

## 2. `nut.js`ライブラリを使う

`nut.js`もNode.jsでの自動化をサポートするライブラリです。こちらもマウスやキーボードの操作を行えます。

### インストール

以下のコマンドでインストールします。

```bash
npm install @nut-tree/nut-js
```

### 使用例

以下のコードは、マウスとキーボードに関する基本的な操作の例です。

```javascript
const { keyboard, Key, mouse, Mouse } = require('@nut-tree/nut-js');

// マウスを移動
await mouse.moveMouse({ x: 100, y: 100 });
await mouse.click(Mouse.Button.Left);

// キーボードに入力
await keyboard.type('Hello, World!');
```

## 注意事項

- 一部のライブラリは特定のプラットフォーム（Windows、Linux、macOS）に依存する可能性があるため、使用するライブラリに応じてドキュメントを確認してください。
- 自動化ツールは不適切な使用が法律や利用規約に違反する可能性があるため、注意が必要です。

## プログラムの作成と実行方法

Node.jsでマウスやキーボードを操作するプログラムを作成した後の実行方法を説明します。

### 1. プログラムの作成

以下の内容で`script.js`というファイルを作成します。

```javascript
const robot = require('robotjs');

// 画面の中心の座標を取得
const screenSize = robot.getScreenSize();
const centerX = Math.floor(screenSize.width / 2);
const centerY = Math.floor(screenSize.height / 2);

// マウスを画面の中心に移動
robot.moveMouse(centerX, centerY);

// マウスの左ボタンをクリック
robot.mouseClick();

// キーボードに「Hello, World!」と入力
robot.typeString('Hello, World!');
```

### 2. Node.jsのインストール

Node.jsがインストールされていない場合は、[Node.jsの公式サイト](https://nodejs.org/)からインストーラをダウンロードし、インストールします。

### 3. ライブラリのインストール

次に、`robotjs`をインストールします。以下のコマンドをターミナルやコマンドプロンプトで実行します。

```bash
npm install robotjs
```

### 4. プログラムの実行

コマンドラインでプログラムを実行するには、以下のステップに従ってください。

1. ターミナルやコマンドプロンプトを開きます。
2. プログラムが保存されているディレクトリに移動します。
3. 以下のコマンドでプログラムを実行します。

   ```bash
   node script.js
   ```

### 注意事項

- プログラムが実行されると、マウスが動いたり、キーボードが入力されたりします。実行中に他のアプリケーションに影響を与える可能性があるため、注意してください。
- マウスやキーボードの自動操作を行うプログラムは、意図せぬ操作を引き起こすことがあるため、十分にテストを行ってください。

### デバッグ及び確認

問題が発生した場合、以下を確認してください：

- Node.jsのバージョンが正しいか（`node -v`で確認）。
- `robotjs`が正しくインストールされているか。
- 他のアプリケーションが正常に動作する状態で実行しているか。

これで、Node.jsを使用してPCの操作を自動化する方法についての解説は終了です。他に質問があればどうぞ！