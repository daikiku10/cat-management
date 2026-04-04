# CLAUDE.md

このファイルは、Claude Code (claude.ai/code) がこのリポジトリで作業する際のガイダンスを提供します。

## プロジェクト概要

猫管理アプリケーション。pnpm モノレポ構成：
- **apps/api** - Hono による API サーバー
- **apps/mobile** - Expo/React Native モバイルアプリ
- **packages/db** - Drizzle ORM による共有データベース層

## 主要コマンド

```bash
# 開発（全アプリを並列実行）
pnpm dev

# API のみ（ポート 8080）
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

# DB マイグレーション
cd packages/db && pnpm db:generate   # スキーマ変更からマイグレーション生成
cd packages/db && pnpm db:migrate    # マイグレーション適用
cd packages/db && pnpm db:studio     # Drizzle Studio 起動
```

## アーキテクチャ

### API レイヤー (apps/api)
- Hono + `@hono/node-server`（ポート 8080）
- ルートは `src/routes/auth/` と `src/routes/cats/` に分割。各ファイルが単一エンドポイントを担当
- Valibot によるバリデーション（`src/lib/validators/`）
- データベースクライアントは `src/db.ts` で初期化
- `src/lib/middleware/auth.ts` の `requireAuth` ミドルウェアが JWT を検証し、`userId` を Hono コンテキストにセット
- パスエイリアス: `@/*` → `src/*`

**API エンドポイント:**
- `POST /api/auth/register` / `POST /api/auth/login` / `POST /api/auth/logout`
- `GET/POST /api/cats/` - 一覧取得・作成（認証必須）
- `GET/PATCH/DELETE /api/cats/:id` - 詳細・更新・削除（認証必須）

**実装パターン（重要）:**
- エラーは `return c.json(...)` ではなく `throw new HTTPException(status, { message })` を使う
- バリデーションは `vValidator("json", schema, validationHook)` の形式で統一（`src/lib/validators/index.ts` の `validationHook` を必ず渡す）
- DB の存在確認は `.returning()` で1クエリにまとめる（`findFirst` → 操作の2往復を避ける）
- グローバルミドルウェア（`logger`, `secureHeaders`）は `src/index.ts` で一括登録済み。ルートファイルに追加しない
- 起動時に必須環境変数を検証済み。`process.env.XXX!` の非 null アサーションは `src/index.ts` の検証を前提とする

### モバイルアプリ (apps/mobile)
- Expo Router によるファイルベースルーティング
- `(auth)/` - 未認証ルート（login, register）
- `(tabs)/` - 認証済みルート（ホーム）
- `cats/` - 猫詳細・作成・編集画面
- 認証状態は `contexts/auth-context.tsx` の `AuthProvider` でグローバル管理
- ルートレイアウト `app/_layout.tsx` でトークンの有無に応じてルートを切り替え
- API クライアントは `lib/api/client.ts`（Axios）。認証トークンをインターセプターで自動付与
- API 呼び出しは `lib/api/auth.ts`・`lib/api/cats.ts` に集約

### データベース (packages/db)
- LibSQL (Turso) + Drizzle ORM
- スキーマ定義は `src/schema.ts`（`users` テーブル・`cats` テーブル）
- `cats.ownerId` は `users.id` への外部キー（カスケード削除）
- `createdAt` / `updatedAt` は `$defaultFn` / `$onUpdateFn` でスキーマ側に自動設定。アプリ側で `new Date()` を渡さない
- ワークスペース依存として `@repo/db` でインポート

## 環境変数

**apps/api/.env:**
- `DATABASE_URL` - LibSQL 接続文字列
- `TORSO_TOKEN` - Turso 認証トークン
- `JWT_SECRET` - JWT 署名シークレット

**apps/mobile/.env.local:**
- `EXPO_PUBLIC_API_HOST` - API ホスト（デフォルト: `localhost`、ポート 8080）

## 主要パターン

- React Compiler を API とモバイル両方で有効化（パフォーマンス向上）
- Expo New Architecture 有効
- 全パッケージで TypeScript strict モード
- `@repo/db` を通じて型とスキーマを共有

## サブエージェント

`.claude/.agents/` に専門エージェントを配置：
- `api-dev.md` - API バックエンド（Hono / Valibot / 認証）担当
- `drizzle-dev.md` - データベース層（Drizzle ORM / スキーマ / マイグレーション）担当
