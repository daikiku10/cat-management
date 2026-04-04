import { db } from "@/db";
import { loginSchema } from "@/lib/validators/auth";
import { users } from "@repo/db";
import { Hono } from "hono";
import { vValidator } from "@hono/valibot-validator";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

const login = new Hono();

login.post("/", vValidator("json", loginSchema), async (c) => {
  const { email, password } = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where: eq(users.email, email),
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return c.json({ error: "Invalid credentials" }, 401);
  }

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });

  return c.json({ token });
});

export { login };
