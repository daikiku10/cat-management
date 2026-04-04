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

  try {
    const now = new Date();
    const [cat] = await db
      .insert(cats)
      .values({
        id: nanoid(),
        ownerId: userId,
        ...body,
        createdAt: now,
        updatedAt: now,
      })
      .returning();
    return c.json(cat, 201);
  } catch (error) {
    console.error("猫の作成に失敗しました:", error);
    return c.json({ error: "猫の作成に失敗しました" }, 500);
  }
});

export { create };
