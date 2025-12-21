import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@repo/db";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TORSO_TOKEN!,
});

export const db = drizzle(client, { schema });
