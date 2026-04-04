import { db } from "@/db";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
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
      throw new HTTPException(404, { message: "猫が見つかりません" });
    }

    return c.body(null, 204);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    console.error("猫の削除に失敗しました:", err);
    throw new HTTPException(500, { message: "猫の削除に失敗しました" });
  }
});

export { deleteCat };
