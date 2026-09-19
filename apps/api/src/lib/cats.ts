import { db } from "@/db";
import { cats } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

export async function assertCatOwnership(catId: string, userId: string) {
  const cat = await db.query.cats.findFirst({
    where: and(eq(cats.id, catId), eq(cats.ownerId, userId)),
    columns: { id: true },
  });

  if (!cat) {
    throw new HTTPException(404, { message: "猫が見つかりません" });
  }
}
