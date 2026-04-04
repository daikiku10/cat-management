import { db } from "@/db";
import { registerSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { vValidator } from "@hono/valibot-validator";
import { validationHook } from "@/lib/validators";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const register = new Hono();

register.post("/", vValidator("json", registerSchema, validationHook), async (c) => {
  const { email, password } = c.req.valid("json");

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      id: nanoid(),
      email,
      passwordHash,
    });

    return c.json({ ok: true }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE constraint failed")) {
      throw new HTTPException(409, { message: "このメールアドレスはすでに使用されています" });
    }
    console.error("登録に失敗しました:", error);
    throw new HTTPException(500, { message: "登録に失敗しました" });
  }
});

export { register };
