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

- `EXPO_PUBLIC_API_HOST` - API ホスト（デフォルト: `localhost`、ポート 8080）

## 主要パターン

- React Compiler 有効化（パフォーマンス向上）
- Expo New Architecture 有効
- TypeScript strict モード
- `@repo/db` を通じて型とスキーマを共有
