import { db } from "@/db";
import { registerSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";

const register = new Hono();

register.post("/", vValidator("json", registerSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const existing = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: { id: true },
  });

  if (existing) {
    return c.json({ error: "このメールアドレスはすでに使用されています" }, 409);
  }

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      id: nanoid(),
      email,
      passwordHash,
      createdAt: new Date(),
    });

    return c.json({ ok: true }, 201);
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "このメールアドレスはすでに使用されています" }, 409);
    }
    console.error("登録に失敗しました:", error);
    return c.json({ error: "登録に失敗しました" }, 500);
  }
});

export { register };
