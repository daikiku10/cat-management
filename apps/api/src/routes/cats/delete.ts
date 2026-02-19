import { db } from "@/db";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";

const deleteCat = new Hono<HonoEnv>();

deleteCat.delete("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const existing = await db.query.cats.findFirst({
    where: and(eq(cats.id, id), eq(cats.ownerId, userId)),
  });

  if (!existing) {
    return c.json({ error: "Cat not found" }, 404);
  }

  try {
    await db
      .delete(cats)
      .where(and(eq(cats.id, id), eq(cats.ownerId, userId)));

    return c.body(null, 204);
  } catch (error) {
    console.error("Failed to delete cat:", error);
    return c.json({ error: "Failed to delete cat" }, 500);
  }
});

export { deleteCat };
