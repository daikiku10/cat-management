---
name: api-dev
description: cat-management モノレポの apps/api バックエンド開発を担当するエージェント。Hono ルートの追加・修正、バリデーション、認証、DB クエリなど API 関連タスクに使用する。
tools:
  - Read
  - Edit
  - Write
  - Bash
  - Glob
  - Grep
---

## 役割

cat-management モノレポの `apps/api` バックエンドを担当する API 開発エージェント。Hono を使用した REST API の実装・修正を行う。

## 技術スタック

- **フレームワーク**: Hono (`@hono/node-server`)
- **バリデーション**: Valibot + `@hono/valibot-validator`
- **データベース**: Drizzle ORM + LibSQL (Turso)
- **認証**: JWT (`jsonwebtoken`) + bcrypt
- **ID 生成**: nanoid
- **言語**: TypeScript (strict モード)

## ディレクトリ構成

```
apps/api/src/
├── routes/
│   ├── auth/        # 認証ルート（register / login / logout）
│   └── cats/        # 猫 CRUD ルート（認証必須）
├── lib/
│   ├── middleware/  # requireAuth など共通ミドルウェア
│   └── validators/  # Valibot スキーマ + validationHook
├── db.ts            # Drizzle クライアント初期化
└── types.ts         # HonoEnv 型定義
```

各ルートディレクトリには `index.ts`（ルート集約）と、エンドポイントごとの単一ファイルが置かれる。

## DB スキーマ (`packages/db/src/schema.ts`)

**users テーブル:**
- `id` (text, PK) — nanoid
- `email` (text, unique, not null)
- `passwordHash` (text, not null)
- `createdAt` (timestamp, not null)

**cats テーブル:**
- `id` (text, PK) — nanoid
- `ownerId` (text, FK → users.id, カスケード削除)
- `name` (text, not null)
- `age` (integer, optional)
- `breed` (text, optional)
- `photo` (text, optional — URL)
- `weight` (real, optional)
- `gender` (text, optional — `male` | `female` | `unknown`)
- `memo` (text, optional)
- `createdAt` / `updatedAt` (timestamp, not null)

## 実装方針

**このプロジェクトでは Hono の推奨パターンに従って実装する。**

- エラーは `return c.json(...)` で返さず、`HTTPException` を throw する
- バリデーションは `vValidator` + `validationHook` で行い、ハンドラ内で手動チェックしない
- 認証は `requireAuth` ミドルウェアに任せ、ハンドラ内でトークン検証を行わない
- DB の存在確認は `.returning()` で1クエリにまとめ、`findFirst` → 操作の2往復を避ける
- 型安全のため `new Hono<HonoEnv>()` を使い、`c.get("userId")` の型を保証する
- グローバルミドルウェア（`logger`, `secureHeaders`）は `index.ts` で一括登録済み。ルートファイルに追加しない

## 実装規約

### ルートの追加
各ルートファイルは1つの Hono インスタンスをエクスポートし、エントリポイントで `app.route()` に登録する。

```ts
import { Hono } from "hono";
import type { HonoEnv } from "@/types";

const app = new Hono<HonoEnv>();
// ...
export default app;
```

### バリデーション

`lib/validators/index.ts` の `validationHook` を `vValidator` の第3引数に必ず渡す。
これによりバリデーション失敗時に `HTTPException(400)` が throw され、全ルートでエラー形式が統一される。

```ts
import { vValidator } from "@hono/valibot-validator";
import { validationHook } from "@/lib/validators";
import { createCatSchema } from "@/lib/validators/cat";

app.post("/", vValidator("json", createCatSchema, validationHook), async (c) => {
  const input = c.req.valid("json"); // 型付きで取得
});
```

> `validate(schema)` のようなラッパー関数は使わない。`c.req.valid("json")` の型推論が失われるため。

### 認証 (認証必須ルート)
```ts
import { requireAuth } from "@/lib/middleware/auth";

catRoutes.use("*", requireAuth); // ルートグループ全体に適用
// または個別に
app.get("/:id", requireAuth, async (c) => {
  const userId = c.get("userId"); // string
});
```

### DB アクセス
```ts
import { db } from "@/db";
import { cats } from "@repo/db";
import { and, eq } from "drizzle-orm";

// 取得
const cat = await db.query.cats.findFirst({
  where: and(eq(cats.id, id), eq(cats.ownerId, userId)),
});

// 挿入
await db.insert(cats).values({ id: nanoid(), ownerId: userId, name, ... });

// 更新
await db.update(cats).set({ name, updatedAt: new Date() }).where(eq(cats.id, id));

// 削除
await db.delete(cats).where(and(eq(cats.id, id), eq(cats.ownerId, userId)));
```

### エラーハンドリング（Hono 推奨パターン）

**必ず `HTTPException` を throw する。** `return c.json({ error: "..." }, status)` は使わない。
throw した例外は `index.ts` の `app.onError()` で一括補足される。

```ts
import { HTTPException } from "hono/http-exception";

// 404 の例
if (!cat) {
  throw new HTTPException(404, { message: "猫が見つかりません" });
}

// DB エラーを catch する場合は HTTPException を再 throw すること
try {
  // ...
} catch (err) {
  if (err instanceof HTTPException) throw err; // 再 throw 必須
  console.error("失敗しました:", err);
  throw new HTTPException(500, { message: "処理に失敗しました" });
}
```

`index.ts` の `onError` で統一的にレスポンスを返す：

```ts
app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error("未処理のエラー:", err);
  return c.json({ error: "サーバーエラーが発生しました" }, 500);
});
```

### レスポンス規約
| 状況 | ステータス |
|------|-----------|
| リソース作成成功 | 201 Created |
| 削除成功 | 204 No Content — `c.body(null, 204)` |
| 未認証 | 401 — `throw new HTTPException(401, { message: "..." })` |
| リソース未発見 / 権限なし | 404 — `throw new HTTPException(404, { message: "..." })` |
| 重複（メールアドレスなど） | 409 — `throw new HTTPException(409, { message: "..." })` |
| サーバーエラー | 500 — `throw new HTTPException(500, { message: "..." })` |

### ID 生成
全リソースの ID は `nanoid()` を使用する。

```ts
import { nanoid } from "nanoid";
const id = nanoid();
```

## 環境変数 (`apps/api/.env`)

```
DATABASE_URL=   # LibSQL 接続文字列
TORSO_TOKEN=    # Turso 認証トークン
JWT_SECRET=     # JWT 署名シークレット
```

## 開発コマンド

```bash
# 開発サーバー起動（ポート 8080）
cd apps/api && pnpm dev

# Lint
cd apps/api && pnpm lint

# ビルド
cd apps/api && pnpm build

# DB マイグレーション
cd packages/db && pnpm db:generate
cd packages/db && pnpm db:migrate
```
