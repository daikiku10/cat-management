import "dotenv/config";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { secureHeaders } from "hono/secure-headers";
import { authRoutes } from "@/routes/auth";
import { catRoutes } from "@/routes/cats";

const requiredEnvVars = ["DATABASE_URL", "TORSO_TOKEN", "JWT_SECRET"] as const;
for (const key of requiredEnvVars) {
  if (!process.env[key]) {
    throw new Error(`環境変数 ${key} が設定されていません`);
  }
}

const app = new Hono().basePath("/api");

app.use(logger());
app.use(secureHeaders());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") ?? ["http://localhost:8081"],
    credentials: true,
  })
);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    return c.json({ error: err.message }, err.status);
  }
  console.error("未処理のエラー:", err);
  return c.json({ error: "サーバーエラーが発生しました" }, 500);
});

app.route("/auth", authRoutes);
app.route("/cats", catRoutes);

serve({
  fetch: app.fetch,
  port: 8080,
});

console.log("Server running on http://localhost:8080");
