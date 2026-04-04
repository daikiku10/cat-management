import { Hono } from "hono";
import { requireAuth } from "@/lib/middleware/auth";
import type { HonoEnv } from "@/lib/types";

const logout = new Hono<HonoEnv>();

logout.post("/", requireAuth, async (c) => {
  return c.json({ ok: true });
});

export { logout };
