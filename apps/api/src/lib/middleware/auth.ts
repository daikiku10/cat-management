import type { Context, Next } from "hono";
import { HTTPException } from "hono/http-exception";
import jwt from "jsonwebtoken";
import { db } from "@/db";
import { sessions } from "@repo/db";
import { and, eq, gt } from "drizzle-orm";
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

  let payload: { userId: string; jti: string };
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] }) as {
      userId: string;
      jti: string;
    };
    if (typeof decoded.userId !== "string" || typeof decoded.jti !== "string") {
      throw new HTTPException(401, { message: "無効なトークンです" });
    }
    payload = decoded;
  } catch (err) {
    if (err instanceof HTTPException) throw err;
    throw new HTTPException(401, { message: "無効なトークンです" });
  }

  const session = await db.query.sessions.findFirst({
    where: and(eq(sessions.id, payload.jti), gt(sessions.expiresAt, new Date())),
  });

  if (!session) {
    throw new HTTPException(401, { message: "無効なトークンです" });
  }

  c.set("userId", payload.userId);
  c.set("sessionId", payload.jti);
  await next();
}
