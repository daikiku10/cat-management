import { db } from "@/db";
import { cats } from "@repo/db";
import { eq, desc, count } from "drizzle-orm";
import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";

const list = new Hono<HonoEnv>();

list.get("/", async (c) => {
  const userId = c.get("userId");
  const limit = Math.min(Math.max(Number(c.req.query("limit")) || 20, 1), 100);
  const offset = Math.max(Number(c.req.query("offset")) || 0, 0);

  const [catList, totalResult] = await Promise.all([
    db
      .select()
      .from(cats)
      .where(eq(cats.ownerId, userId))
      .orderBy(desc(cats.createdAt))
      .limit(limit)
      .offset(offset),
    db
      .select({ count: count() })
      .from(cats)
      .where(eq(cats.ownerId, userId)),
  ]);

  return c.json({
    cats: catList,
    total: totalResult[0]?.count ?? 0,
  });
});

export { list };
