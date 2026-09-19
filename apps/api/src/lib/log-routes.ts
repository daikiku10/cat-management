import { db } from "@/db";
import { assertCatOwnership } from "@/lib/cats";
import { validationHook } from "@/lib/validators";
import { catIdParamSchema, logIdParamSchema } from "@/lib/validators/log";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import { eq, and, desc, count } from "drizzle-orm";
import type { AnySQLiteTable } from "drizzle-orm/sqlite-core";
import type { SQLiteColumn } from "drizzle-orm/sqlite-core";
import { nanoid } from "nanoid";
import type { Context } from "hono";
import type { HonoEnv } from "@/lib/types";
import type { BaseIssue, BaseSchema, InferInput } from "valibot";

function parsePagination(c: Context) {
  const limit = Math.min(Math.max(Number(c.req.query("limit")) || 20, 1), 100);
  const offset = Math.max(Number(c.req.query("offset")) || 0, 0);
  return { limit, offset };
}

type LogTable = AnySQLiteTable & {
  id: SQLiteColumn;
  catId: SQLiteColumn;
  createdAt: SQLiteColumn;
};

type LogRouteOptions<T extends LogTable, S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>> = {
  /** URL セグメント。例: "feeding-logs" */
  path: string;
  table: T;
  createSchema: S;
  /** 一覧レスポンス・作成ボディのキー名。例: "feedingLogs" */
  resourceKey: string;
  /** エラーメッセージ用のラベル。例: "食事記録" */
  resourceLabel: string;
};

/**
 * 猫にひも付く記録リソース（食事記録・うんち記録など）の
 * create / list / delete ルートをまとめて生成する。
 */
export function createLogRoutes<T extends LogTable, S extends BaseSchema<unknown, unknown, BaseIssue<unknown>>>({
  path,
  table,
  createSchema,
  resourceKey,
  resourceLabel,
}: LogRouteOptions<T, S>) {
  const app = new Hono<HonoEnv>();

  app.post(
    `/:catId/${path}`,
    vValidator("param", catIdParamSchema, validationHook),
    vValidator("json", createSchema, validationHook),
    async (c) => {
      const userId = c.get("userId");
      const { catId } = c.req.valid("param");
      const body = c.req.valid("json") as InferInput<S> & Record<string, unknown>;

      await assertCatOwnership(catId, userId);

      try {
        const [log] = await db
          .insert(table)
          .values({ id: nanoid(), catId, ...body } as T["$inferInsert"])
          .returning();

        if (!log) {
          throw new HTTPException(500, { message: `${resourceLabel}の作成に失敗しました` });
        }

        return c.json(log, 201);
      } catch (err) {
        if (err instanceof HTTPException) throw err;
        console.error(`${resourceLabel}の作成に失敗しました:`, err);
        throw new HTTPException(500, { message: `${resourceLabel}の作成に失敗しました` });
      }
    }
  );

  app.get(
    `/:catId/${path}`,
    vValidator("param", catIdParamSchema, validationHook),
    async (c) => {
      const userId = c.get("userId");
      const { catId } = c.req.valid("param");
      const { limit, offset } = parsePagination(c);

      await assertCatOwnership(catId, userId);

      const [logs, totalResult] = await Promise.all([
        db
          .select()
          .from(table)
          .where(eq(table.catId, catId))
          .orderBy(desc(table.createdAt))
          .limit(limit)
          .offset(offset),
        db.select({ count: count() }).from(table).where(eq(table.catId, catId)),
      ]);

      const total = totalResult[0] ? totalResult[0].count : 0;
      return c.json({ [resourceKey]: logs, total });
    }
  );

  app.delete(
    `/:catId/${path}/:logId`,
    vValidator("param", logIdParamSchema, validationHook),
    async (c) => {
      const userId = c.get("userId");
      const { catId, logId } = c.req.valid("param");

      await assertCatOwnership(catId, userId);

      try {
        const [deleted] = await db
          .delete(table)
          .where(and(eq(table.id, logId), eq(table.catId, catId)))
          .returning();

        if (!deleted) {
          throw new HTTPException(404, { message: "記録が見つかりません" });
        }

        return c.body(null, 204);
      } catch (err) {
        if (err instanceof HTTPException) throw err;
        console.error(`${resourceLabel}の削除に失敗しました:`, err);
        throw new HTTPException(500, { message: `${resourceLabel}の削除に失敗しました` });
      }
    }
  );

  return app;
}
