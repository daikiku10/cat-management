# CLAUDE.md (packages/db)

packages/db ディレクトリ内で作業する際のガイダンスです。全体構成は [ルートの CLAUDE.md](../../CLAUDE.md) を参照してください。

## 概要

Drizzle ORM による共有データベース層。`@repo/db` としてワークスペース間でインポートされます。

## 主要コマンド

```bash
cd packages/db && pnpm db:generate   # スキーマ変更からマイグレーション生成
cd packages/db && pnpm db:migrate    # マイグレーション適用
cd packages/db && pnpm db:studio     # Drizzle Studio 起動
cd packages/db && pnpm db:seed       # 猫種マスタ(breeds)のシード投入
```

## アーキテクチャ

- LibSQL (Turso) + Drizzle ORM
- スキーマ定義は `src/schema.ts`（`users` テーブル・`cats` テーブル）
- `cats.ownerId` は `users.id` への外部キー（カスケード削除）
- `createdAt` / `updatedAt` は `$defaultFn` / `$onUpdateFn` でスキーマ側に自動設定。アプリ側で `new Date()` を渡さない
- ワークスペース依存として `@repo/db` でインポート

## 主要パターン

- TypeScript strict モード
