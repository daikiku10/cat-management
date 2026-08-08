import { relations } from "drizzle-orm";
import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
});

export const breeds = sqliteTable("breeds", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  origin: text("origin"),
  temperament: text("temperament"),
  lifeSpan: text("life_span"),
});

export const cats = sqliteTable("cats", {
  id: text("id").primaryKey(),
  ownerId: text("owner_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  age: integer("age"),
  breedId: text("breed_id").references(() => breeds.id, { onDelete: "set null" }),
  photo: text("photo"),
  weight: real("weight"),
  gender: text("gender").$type<"male" | "female" | "unknown">(),
  memo: text("memo"),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .$defaultFn(() => new Date())
    .$onUpdateFn(() => new Date()),
});

export const breedsRelations = relations(breeds, ({ many }) => ({
  cats: many(cats),
}));

export const catsRelations = relations(cats, ({ one }) => ({
  breed: one(breeds, { fields: [cats.breedId], references: [breeds.id] }),
}));
