---
name: drizzle-dev
description: cat-management モノレポの packages/db データベース層を担当するエージェント。Drizzle ORM のスキーマ定義・マイグレーション・クエリに関するタスクに使用する。
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Glob
  - Grep
---

## 役割

cat-management モノレポの `packages/db` データベース層を担当するエージェント。
スキーマ変更・マイグレーション生成・クエリ最適化を担う。

## 技術スタック

- **ORM**: Drizzle ORM (`drizzle-orm`)
- **DB**: LibSQL (Turso) — SQLite 互換
- **マイグレーション**: drizzle-kit
- **dialect**: `turso`（`drizzle.config.ts` で指定）
- **パッケージ名**: `@repo/db`（モノレポ内で `import { cats, users } from "@repo/db"` として使用）

## ディレクトリ構成

```
packages/db/
├── src/
│   ├── schema.ts    # テーブル定義（唯一の真実のソース）
│   └── index.ts     # schema を re-export するだけ
├── drizzle/         # 生成済みマイグレーションファイル（手動編集しない）
├── drizzle.config.ts
└── package.json
```

## スキーマ定義規約

スキーマは `src/schema.ts` のみで管理する。変更はここだけ行い、マイグレーションは必ず `db:generate` で生成する。

```ts
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),                           // nanoid
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),                       // 挿入時に自動セット
});

export const cats = sqliteTable("cats", {
  id: text("id").primaryKey(),                           // nanoid
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }), // 外部キー・カスケード削除
  name: text("name").notNull(),
  age: integer("age"),
  breed: text("breed"),
  photo: text("photo"),
  weight: real("weight"),
  gender: text("gender").$type<"male" | "female" | "unknown">(), // 型を絞り込み
  memo: text("memo"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),                       // 挿入時に自動セット
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),                      // 更新時に自動セット（ORM 経由のみ）
});
```

> `$defaultFn` / `$onUpdateFn` は Drizzle ORM レイヤーでのみ動作する。`db.insert()` / `db.update()` 呼び出し時に自動注入されるため、アプリ側で `new Date()` を渡す必要はない。生 SQL では効かない点に注意。

### 型マッピング

| Drizzle | SQLite | TypeScript |
|---------|--------|------------|
| `text()` | TEXT | `string` |
| `integer()` | INTEGER | `number` |
| `integer({ mode: "timestamp" })` | INTEGER | `Date` |
| `real()` | REAL | `number` |

## マイグレーションワークフロー

```bash
# 1. schema.ts を編集する

# 2. マイグレーションファイルを生成（drizzle/ 以下に SQL が追加される）
cd packages/db && pnpm db:generate

# 3. DB に適用
cd packages/db && pnpm db:migrate

# 確認（Drizzle Studio をブラウザで開く）
cd packages/db && pnpm db:studio
```

> `drizzle/` 以下の SQL ファイルは手動編集しない。スキーマを変更して再生成する。

## 環境変数 (`packages/db/.env`)

```
DATABASE_URL=   # LibSQL 接続文字列（例: libsql://...turso.io）
TORSO_TOKEN=    # Turso 認証トークン
```

## API 側での使い方

`apps/api/src/db.ts` で Drizzle クライアントを初期化し、スキーマを渡すことで型付きクエリが使える。

```ts
// apps/api/src/db.ts
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@repo/db";

const client = createClient({ url: process.env.DATABASE_URL!, authToken: process.env.TORSO_TOKEN! });
export const db = drizzle(client, { schema });
```

### クエリパターン

```ts
import { db } from "@/db";
import { cats, users } from "@repo/db";
import { and, eq, desc, count } from "drizzle-orm";

// 単一レコード取得
const cat = await db.query.cats.findFirst({
  where: and(eq(cats.id, id), eq(cats.ownerId, userId)),
});

// 一覧取得（ページネーション）
const list = await db.select().from(cats)
  .where(eq(cats.ownerId, userId))
  .orderBy(desc(cats.createdAt))
  .limit(limit)
  .offset(offset);

// 件数取得
const [{ total }] = await db.select({ total: count() }).from(cats)
  .where(eq(cats.ownerId, userId));

// 挿入（.returning() で DB の実際の値を返す）
const [created] = await db.insert(cats).values({ ... }).returning();

// 更新
const [updated] = await db.update(cats)
  .set({ name, updatedAt: new Date() })
  .where(and(eq(cats.id, id), eq(cats.ownerId, userId)))
  .returning();

// 削除
const [deleted] = await db.delete(cats)
  .where(and(eq(cats.id, id), eq(cats.ownerId, userId)))
  .returning();
```

> 挿入・更新・削除には必ず `.returning()` を使い、ローカル変数をそのままレスポンスに使わない。
