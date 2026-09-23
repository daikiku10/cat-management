# CLAUDE.md (apps/mobile)

apps/mobile ディレクトリ内で作業する際のガイダンスです。全体構成は [ルートの CLAUDE.md](../../CLAUDE.md) を参照してください。

## 概要

Expo/React Native によるモバイルアプリ。

## 主要コマンド

```bash
cd apps/mobile && pnpm start    # Expo 開発サーバー起動
cd apps/mobile && pnpm ios      # iOS シミュレーター
cd apps/mobile && pnpm android  # Android エミュレーター
cd apps/mobile && pnpm lint     # Lint
```

## アーキテクチャ

- Expo Router によるファイルベースルーティング
- `(auth)/` - 未認証ルート（login, register）
- `(tabs)/` - 認証済みルート（ホーム）
- `cats/` - 猫詳細・作成・編集画面
- 認証状態は `contexts/auth-context.tsx` の `AuthProvider` でグローバル管理
- ルートレイアウト `app/_layout.tsx` でトークンの有無に応じてルートを切り替え
- API クライアントは `lib/api/client.ts`（Axios）。認証トークンをインターセプターで自動付与
- API 呼び出しは `lib/api/auth.ts`・`lib/api/cats.ts` に集約

## 環境変数（apps/mobile/.env.local）

- `EXPO_PUBLIC_API_HOST` - API ホスト（デフォルト: `localhost`、ポート 8080）。ローカル開発用
- `EXPO_PUBLIC_API_URL` - API のフルURL（例: `https://xxxx.vercel.app`）。設定時は `EXPO_PUBLIC_API_HOST` より優先。本番ビルドで使用

## 主要パターン

- React Compiler 有効化（パフォーマンス向上）
- Expo New Architecture 有効
- TypeScript strict モード
- `@repo/db` を通じて型とスキーマを共有

## Web 版デプロイ（Vercel）

- `vercel.json` で `npx expo export -p web` の静的出力（`dist`）を配信
- Vercel プロジェクトの Root Directory は `apps/mobile`、環境変数 `EXPO_PUBLIC_API_URL` に API の URL を設定
- API 側の `CORS_ORIGIN` に Web 版の URL を追加すること
- Web ではトークンを `expo-secure-store` ではなく `localStorage` に保存（`lib/auth.ts`）
