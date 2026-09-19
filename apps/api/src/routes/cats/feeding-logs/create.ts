import { db } from "@/db";
import { createFeedingLogSchema, catIdParamSchema } from "@/lib/validators/feeding-log";
import { validationHook } from "@/lib/validators";
import { assertCatOwnership } from "@/lib/cats";
import { feedingLogs } from "@repo/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import type { HonoEnv } from "@/lib/types";
import { nanoid } from "nanoid";

const create = new Hono<HonoEnv>();

create.post(
  "/:catId/feeding-logs",
  vValidator("param", catIdParamSchema, validationHook),
  vValidator("json", createFeedingLogSchema, validationHook),
  async (c) => {
    const userId = c.get("userId");
    const { catId } = c.req.valid("param");
    const body = c.req.valid("json");

    await assertCatOwnership(catId, userId);

    try {
      const [log] = await db
        .insert(feedingLogs)
        .values({
          id: nanoid(),
          catId,
          ...body,
        })
        .returning();

      if (!log) {
        throw new HTTPException(500, { message: "食事記録の作成に失敗しました" });
      }

      return c.json(log, 201);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      console.error("食事記録の作成に失敗しました:", err);
      throw new HTTPException(500, { message: "食事記録の作成に失敗しました" });
    }
  }
);

export { create };
