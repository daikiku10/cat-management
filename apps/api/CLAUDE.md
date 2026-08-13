# CLAUDE.md (apps/api)

apps/api ディレクトリ内で作業する際のガイダンスです。全体構成は [ルートの CLAUDE.md](../../CLAUDE.md) を参照してください。

## 概要

Hono による API サーバー（ポート 8080）。

## 主要コマンド

```bash
cd apps/api && pnpm dev     # 開発サーバー起動
cd apps/api && pnpm lint    # Lint
cd apps/api && pnpm build   # ビルド
```

## アーキテクチャ

- Hono + `@hono/node-server`（ポート 8080）
- ルートは `src/routes/auth/` と `src/routes/cats/` に分割。各ファイルが単一エンドポイントを担当
- Valibot によるバリデーション（`src/lib/validators/`）
- データベースクライアントは `src/db.ts` で初期化
- `src/lib/middleware/auth.ts` の `requireAuth` ミドルウェアが JWT を検証し、`userId` を Hono コンテキストにセット
- パスエイリアス: `@/*` → `src/*`

## API エンドポイント

- `POST /api/auth/register` / `POST /api/auth/login` / `POST /api/auth/logout`
- `GET/POST /api/cats/` - 一覧取得・作成（認証必須）
- `GET/PATCH/DELETE /api/cats/:id` - 詳細・更新・削除（認証必須）

## 実装パターン（重要）

- エラーは `return c.json(...)` ではなく `throw new HTTPException(status, { message })` を使う
- バリデーションは `vValidator("json", schema, validationHook)` の形式で統一（`src/lib/validators/index.ts` の `validationHook` を必ず渡す）
- DB の存在確認は `.returning()` で1クエリにまとめる（`findFirst` → 操作の2往復を避ける）
- グローバルミドルウェア（`logger`, `secureHeaders`）は `src/index.ts` で一括登録済み。ルートファイルに追加しない
- 起動時に必須環境変数を検証済み。`process.env.XXX!` の非 null アサーションは `src/index.ts` の検証を前提とする

## 環境変数（apps/api/.env）

- `DATABASE_URL` - LibSQL 接続文字列
- `TORSO_TOKEN` - Turso 認証トークン
- `JWT_SECRET` - JWT 署名シークレット

## 主要パターン

- React Compiler 有効化（パフォーマンス向上）
- TypeScript strict モード
- `@repo/db` を通じて型とスキーマを共有
