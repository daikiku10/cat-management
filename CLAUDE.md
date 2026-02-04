# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

猫管理アプリケーション。pnpm モノレポ構成：
- **apps/api** - Hono を使用した Next.js API サーバー
- **apps/mobile** - Expo/React Native モバイルアプリ
- **packages/db** - Drizzle ORM による共有データベース層

## 主要コマンド

```bash
# 開発（全アプリを並列実行）
pnpm dev

# API のみ
cd apps/api && pnpm dev

# モバイルのみ
cd apps/mobile && pnpm start
cd apps/mobile && pnpm ios      # iOS シミュレーター
cd apps/mobile && pnpm android  # Android エミュレーター

# Lint
cd apps/api && pnpm lint
cd apps/mobile && pnpm lint

# ビルド
cd apps/api && pnpm build
```

## アーキテクチャ

### API レイヤー (apps/api)
- Hono + Next.js、catch-all ルート `/app/api/[[...route]]/route.ts` を使用
- Valibot によるバリデーション（`/src/lib/validators/`）
- データベースクライアントは `/src/db.ts` で初期化
- JWT 認証 + bcrypt パスワードハッシュ

### モバイルアプリ (apps/mobile)
- Expo Router によるファイルベースルーティング（Next.js app router と類似）
- タブナビゲーションは `/app/(tabs)/`
- expo-secure-store によるトークン保存（`/lib/auth.ts`）
- テーマ対応コンポーネントは `/components/`

### データベース (packages/db)
- LibSQL (Turso) + Drizzle ORM
- スキーマ定義は `/src/schema.ts`
- ワークスペース依存として `@repo/db` でインポート

## 環境変数

API と DB に必要：
- `DATABASE_URL` - LibSQL 接続文字列
- `TORSO_TOKEN` - LibSQL 認証トークン
- `JWT_SECRET` - JWT 署名シークレット

## 主要パターン

- React Compiler を API とモバイル両方で有効化（パフォーマンス向上）
- Expo New Architecture 有効
- 全パッケージで TypeScript strict モード
- `@repo/db` を通じて型とスキーマを共有
