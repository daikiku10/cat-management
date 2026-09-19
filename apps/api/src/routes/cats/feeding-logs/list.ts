import { db } from "@/db";
import { catIdParamSchema } from "@/lib/validators/feeding-log";
import { validationHook } from "@/lib/validators";
import { assertCatOwnership } from "@/lib/cats";
import { feedingLogs } from "@repo/db";
import { eq, asc } from "drizzle-orm";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import type { HonoEnv } from "@/lib/types";

const list = new Hono<HonoEnv>();

list.get(
  "/:catId/feeding-logs",
  vValidator("param", catIdParamSchema, validationHook),
  async (c) => {
    const userId = c.get("userId");
    const { catId } = c.req.valid("param");

    await assertCatOwnership(catId, userId);

    const logs = await db.query.feedingLogs.findMany({
      where: eq(feedingLogs.catId, catId),
      orderBy: [asc(feedingLogs.fedDate), asc(feedingLogs.mealType)],
    });

    return c.json({ feedingLogs: logs });
  }
);

export { list };
