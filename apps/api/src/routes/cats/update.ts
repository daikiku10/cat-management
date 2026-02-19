import { db } from "@/db";
import { updateCatSchema } from "@/lib/validators/cat";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";
import * as v from "valibot";

const update = new Hono<HonoEnv>();

update.patch("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");
  const body = await c.req.json();

  const parsed = v.safeParse(updateCatSchema, body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        issues: parsed.issues,
      },
      400
    );
  }

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
        ...parsed.output,
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
