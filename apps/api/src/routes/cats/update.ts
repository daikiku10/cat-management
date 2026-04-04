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

  const existing = await db.query.cats.findFirst({
    where: and(eq(cats.id, id), eq(cats.ownerId, userId)),
  });

  if (!existing) {
    return c.json({ error: "Cat not found" }, 404);
  }

  try {
    const updated = await db
      .update(cats)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(and(eq(cats.id, id), eq(cats.ownerId, userId)))
      .returning();

    return c.json(updated[0]);
  } catch (error) {
    console.error("Failed to update cat:", error);
    return c.json({ error: "Failed to update cat" }, 500);
  }
});

export { update };
