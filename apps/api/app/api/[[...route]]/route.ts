import { db } from "@/db";
import { loginSchema, registerSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import { handle } from "hono/vercel";
import * as v from "valibot";
import { nanoid } from "nanoid";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const app = new Hono().basePath("/api");

app.post("/auth/register", async (c) => {
  const body = await c.req.json();

  const parsed = v.safeParse(registerSchema, body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        issues: parsed.issues,
      },
      400
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

app.post("/auth/login", async (c) => {
  const body = await c.req.json();

  const parsed = v.safeParse(loginSchema, body);
  if (!parsed.success) {
    return c.json(
      {
        error: "Invalid request",
        issues: parsed.issues,
      },
      400
    );
  }

  const { email, password } = parsed.output;

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return c.json({ error: "Invalid password" }, 401);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return c.json({ token });
});

export const GET = handle(app);
export const POST = handle(app);
