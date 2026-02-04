import { Hono } from "hono";

const logout = new Hono();

logout.post("/", async (c) => {
  return c.json({ ok: true });
});

export { logout };
