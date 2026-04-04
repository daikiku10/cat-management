import { db } from "@/db";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import type { HonoEnv } from "@/lib/types";

const detail = new Hono<HonoEnv>();

detail.get("/:id", async (c) => {
  const userId = c.get("userId");
  const id = c.req.param("id");

  const cat = await db.query.cats.findFirst({
    where: and(eq(cats.id, id), eq(cats.ownerId, userId)),
  });

  if (!cat) {
    throw new HTTPException(404, { message: "猫が見つかりません" });
  }

  return c.json(cat);
});

export { detail };
