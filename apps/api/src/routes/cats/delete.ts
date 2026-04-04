import { db } from "@/db";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";

const deleteCat = new Hono<HonoEnv>();

deleteCat.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  try {
    const [deleted] = await db
      .delete(cats)
      .where(and(eq(cats.id, id), eq(cats.ownerId, userId)))
      .returning();

    if (!deleted) {
      return c.json({ error: "猫が見つかりません" }, 404);
    }

    return c.body(null, 204);
  } catch (error) {
    console.error("猫の削除に失敗しました:", error);
    return c.json({ error: "猫の削除に失敗しました" }, 500);
  }
});

export { deleteCat };
