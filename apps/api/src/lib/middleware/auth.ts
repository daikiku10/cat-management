import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";

export async function requireAuth(c: Context, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.substring(7);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return c.json({ error: "Internal server error" }, 500);
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as {
      userId: string;
    };
    if (typeof payload.userId !== "string") {
      return c.json({ error: "Invalid token" }, 401);
    }
    c.set("userId", payload.userId);
    await next();
  } catch {
    return c.json({ error: "Invalid token" }, 401);
  }
}
