import { db } from "@/db";
import { breeds } from "@repo/db";
import { asc } from "drizzle-orm";
import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";

const list = new Hono<HonoEnv>();

list.get("/", async (c) => {
  const breedList = await db.select().from(breeds).orderBy(asc(breeds.name));

  return c.json({ breeds: breedList });
});

export { list };
