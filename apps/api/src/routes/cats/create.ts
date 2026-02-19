import { db } from "@/db";
import { createCatSchema } from "@/lib/validators/cat";
import { cats } from "@repo/db";
import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";
import { nanoid } from "nanoid";
import * as v from "valibot";

const create = new Hono<HonoEnv>();

create.post("/", async (c) => {
  const userId = c.get("userId");
  const body = await c.req.json();

  const parsed = v.safeParse(createCatSchema, body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        issues: parsed.issues,
      },
      400
    );
  }

  const now = new Date();
  const cat = {
    id: nanoid(),
    ownerId: userId,
    ...parsed.output,
    createdAt: now,
    updatedAt: now,
  };

  try {
    await db.insert(cats).values(cat);
    return c.json(cat, 201);
  } catch (error) {
    console.error("Failed to create cat:", error);
    return c.json({ error: "Failed to create cat" }, 500);
  }
});

export { create };
