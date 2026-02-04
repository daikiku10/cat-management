import { db } from "@/db";
import { registerSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import * as v from "valibot";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";

const register = new Hono();

register.post("/", async (c) => {
  const body = await c.req.json();

  const parsed = v.safeParse(registerSchema, body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        issues: parsed.issues,
      },
      400,
    );
  }

  const { email, password } = parsed.output;

  const passwordHash = await bcrypt.hash(password, 10);

  await db.insert(users).values({
    id: nanoid(),
    email,
    passwordHash,
    createdAt: new Date(),
  });

  return c.json({ ok: true });
});

export { register };
