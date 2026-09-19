import { Hono } from "hono";
import { requireAuth } from "@/lib/middleware/auth";
import { db } from "@/db";
import { sessions } from "@repo/db";
import { eq } from "drizzle-orm";
import type { HonoEnv } from "@/lib/types";

const logout = new Hono<HonoEnv>();

logout.post("/", requireAuth, async (c) => {
  const sessionId = c.get("sessionId");

  await db.delete(sessions).where(eq(sessions.id, sessionId));

  return c.json({ ok: true });
});

export { logout };
