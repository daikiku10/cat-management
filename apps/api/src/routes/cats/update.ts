import { db } from "@/db";
import { updateCatSchema } from "@/lib/validators/cat";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import type { HonoEnv } from "@/lib/types";

const update = new Hono<HonoEnv>();

update.patch("/:id", vValidator("json", updateCatSchema), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = c.req.valid("json");

  try {
    const [updated] = await db
      .update(cats)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(cats.id, id), eq(cats.ownerId, userId)))
      .returning();

    if (!updated) {
      return c.json({ error: "猫が見つかりません" }, 404);
    }

    return c.json(updated);
  } catch (error) {
    console.error("猫の更新に失敗しました:", error);
    return c.json({ error: "猫の更新に失敗しました" }, 500);
  }
});

export { update };
