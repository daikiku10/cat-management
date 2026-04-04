import { db } from "@/db";
import { createCatSchema } from "@/lib/validators/cat";
import { cats } from "@repo/db";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import type { HonoEnv } from "@/lib/types";
import { nanoid } from "nanoid";

const create = new Hono<HonoEnv>();

create.post("/", vValidator("json", createCatSchema), async (c) => {
  const userId = c.get("userId");
  const body = c.req.valid("json");

  const now = new Date();
  const cat = {
    id: nanoid(),
    ownerId: userId,
    ...body,
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
