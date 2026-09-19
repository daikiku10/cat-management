import { db } from "@/db";
import { updateFeedingLogSchema, logIdParamSchema } from "@/lib/validators/feeding-log";
import { validationHook } from "@/lib/validators";
import { assertCatOwnership } from "@/lib/cats";
import { feedingLogs } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import type { HonoEnv } from "@/lib/types";

const update = new Hono<HonoEnv>();

update.patch(
  "/:catId/feeding-logs/:logId",
  vValidator("param", logIdParamSchema, validationHook),
  vValidator("json", updateFeedingLogSchema, validationHook),
  async (c) => {
    const userId = c.get("userId");
    const { catId, logId } = c.req.valid("param");
    const body = c.req.valid("json");

    await assertCatOwnership(catId, userId);

    try {
      const [updated] = await db
        .update(feedingLogs)
        .set({
          ...body,
        })
        .where(and(eq(feedingLogs.id, logId), eq(feedingLogs.catId, catId)))
        .returning();

      if (!updated) {
        throw new HTTPException(404, { message: "記録が見つかりません" });
      }

      return c.json(updated);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      console.error("食事記録の更新に失敗しました:", err);
      throw new HTTPException(500, { message: "食事記録の更新に失敗しました" });
    }
  }
);

export { update };
