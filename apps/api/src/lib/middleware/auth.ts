import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import type { HonoEnv } from "@/lib/types";

export async function requireAuth(c: Context<HonoEnv>, next: Next) {
  const authHeader = c.req.header("Authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    throw new HTTPException(401, { message: "認証が必要です" });
  }

  const token = authHeader.substring(7);

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new HTTPException(500, { message: "サーバーエラーが発生しました" });
  }

  try {
    const payload = jwt.verify(token, secret, { algorithms: ["HS256"] }) as {
      userId: string;
    };
    if (typeof payload.userId !== "string") {
      throw new HTTPException(401, { message: "無効なトークンです" });
    }
    c.set("userId", payload.userId);
    await next();
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: "無効なトークンです" });
  }
}
