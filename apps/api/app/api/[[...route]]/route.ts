import { authRoutes } from "@/routes/auth";
import { catRoutes } from "@/routes/cats";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);
app.route("/cats", catRoutes);

export const GET = handle(app);
export const POST = handle(app);
export const PATCH = handle(app);
export const DELETE = handle(app);
