# PCスマホテキスト転送

PC・スマホ間でテキストを一時転送するWebアプリです。  
ログイン不要で、アカウント共有できない端末間でも短いテキストを受け渡せます。

**公開URL：https://pctexttransfer.vercel.app/**

## 機能

- テキストを入力して転送データを作成（6桁コード + 3文字合言葉 + QRコード生成）
- 有効期限：作成から3日
- 1回閲覧したら再表示不可
- QRコードを読み取って受信、またはコードを手入力して受信
- URLをコピーしてシェア

## 技術構成

- React 18
- Vite 5
- TypeScript 5
- Tailwind CSS 3
- Supabase（データベース）
- qrcode.react（QRコード生成）
- react-router-dom v6
- デプロイ：Vercel

## ローカル起動

```bash
cp .env.example .env
# .envにSupabaseのURLとキーを設定する
npm install
npm run dev
```

## ルーティング

| URL | 画面 |
|---|---|
| `/` | 送信画面 |
| `/receive` | コード入力による受信画面 |
| `/r/:token` | QR・URL受信用画面 |

## 今後の予定

- [ ] サーバーサイドでの有効期限管理
- [ ] テキストの暗号化

## 注意

機密情報・個人情報・社外秘情報は入力しないでください。
