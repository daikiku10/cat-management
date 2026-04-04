import { db } from "@/db";
import { registerSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const register = new Hono();

register.post("/", vValidator("json", registerSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await db.insert(users).values({
      id: nanoid(),
      email,
      passwordHash,
      createdAt: new Date(),
    });

    return c.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("UNIQUE constraint failed")) {
      return c.json({ error: "Email already in use" }, 409);
    }
    console.error("Failed to register:", error);
    return c.json({ error: "Failed to register" }, 500);
  }
});

export { register };
