import { db } from "@/db";
import { logIdParamSchema } from "@/lib/validators/feeding-log";
import { validationHook } from "@/lib/validators";
import { assertCatOwnership } from "@/lib/cats";
import { feedingLogs } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import type { HonoEnv } from "@/lib/types";

const deleteFeedingLog = new Hono<HonoEnv>();

deleteFeedingLog.delete(
  "/:catId/feeding-logs/:logId",
  vValidator("param", logIdParamSchema, validationHook),
  async (c) => {
    const userId = c.get("userId");
    const { catId, logId } = c.req.valid("param");

    await assertCatOwnership(catId, userId);

    try {
      const [deleted] = await db
        .delete(feedingLogs)
        .where(and(eq(feedingLogs.id, logId), eq(feedingLogs.catId, catId)))
        .returning();

      if (!deleted) {
        throw new HTTPException(404, { message: "記録が見つかりません" });
      }

      return c.body(null, 204);
    } catch (err) {
      if (err instanceof HTTPException) throw err;
      console.error("食事記録の削除に失敗しました:", err);
      throw new HTTPException(500, { message: "食事記録の削除に失敗しました" });
    }
  }
);

export { deleteFeedingLog };
