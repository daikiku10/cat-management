import { db } from "@/db";
import { createCatSchema } from "@/lib/validators/cat";
import { cats } from "@repo/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import { validationHook } from "@/lib/validators";
import type { HonoEnv } from "@/lib/types";
import { nanoid } from "nanoid";

const create = new Hono<HonoEnv>();

create.post("/", vValidator("json", createCatSchema, validationHook), async (c) => {
  const userId = c.get("userId");
  const body = c.req.valid("json");

  try {
    const [cat] = await db
      .insert(cats)
      .values({
        id: nanoid(),
        ownerId: userId,
        ...body,
      })
      .returning();

    if (!cat) {
      throw new HTTPException(500, { message: "猫の作成に失敗しました" });
    }

    return c.json(cat, 201);
  } catch (error) {
    console.error("猫の作成に失敗しました:", error);
    throw new HTTPException(500, { message: "猫の作成に失敗しました" });
  }
});

export { create };
