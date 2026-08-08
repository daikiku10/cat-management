import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";
import { breedSeeds } from "./seed-data/breeds";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.TORSO_TOKEN,
});

const db = drizzle(client, { schema });

async function seed() {
  await db
    .insert(schema.breeds)
    .values(breedSeeds.map((breed) => ({ id: crypto.randomUUID(), ...breed })))
    .onConflictDoNothing({ target: schema.breeds.name });

  console.log(`${breedSeeds.length} 件の猫種マスタをシードしました`);
}

seed()
  .then(() => client.close())
  .catch((err) => {
    console.error("シードに失敗しました:", err);
    client.close();
    process.exit(1);
  });
