import { db } from "@/db";
import { loginSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import * as v from "valibot";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const login = new Hono();

login.post("/", async (c) => {
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

export { login };
