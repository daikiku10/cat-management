import { db } from "@/db";
import { updateCatSchema } from "@/lib/validators/cat";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import { validationHook } from "@/lib/validators";
import type { HonoEnv } from "@/lib/types";

const update = new Hono<HonoEnv>();

update.patch("/:id", vValidator("json", updateCatSchema, validationHook), async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = c.req.valid("json");

  try {
    const [updated] = await db
      .update(cats)
      .set({
        ...body,
      })
      .where(and(eq(cats.id, id), eq(cats.ownerId, userId)))
      .returning();

    if (!updated) {
      throw new HTTPException(404, { message: "猫が見つかりません" });
    }

    return c.json(updated);
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    console.error("猫の更新に失敗しました:", err);
    throw new HTTPException(500, { message: "猫の更新に失敗しました" });
  }
});

export { update };
