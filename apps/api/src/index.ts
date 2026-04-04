import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "@/routes/auth";
import { catRoutes } from "@/routes/cats";

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);
app.route("/cats", catRoutes);

serve({
  fetch: app.fetch,
  port: 8080,
});

console.log("Server running on http://localhost:8080");
