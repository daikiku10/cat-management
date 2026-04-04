import type { Context, Next } from "hono";
import jwt from "jsonwebtoken";
import type { HonoEnv } from "@/lib/types";

export async function requireAuth(c: Context<HonoEnv>, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return c.json({ error: "認証が必要です" }, 401);
  }

  const token = authHeader.substring(7);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return c.json({ error: "サーバーエラーが発生しました" }, 500);
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as {
      userId: string;
    };
    if (typeof payload.userId !== "string") {
      return c.json({ error: "無効なトークンです" }, 401);
    }
    c.set("userId", payload.userId);
    await next();
  } catch {
    return c.json({ error: "無効なトークンです" }, 401);
  }
}
