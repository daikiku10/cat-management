import { authRoutes } from "@/routes/auth";
import { Hono } from "hono";
import { handle } from "hono/vercel";

const app = new Hono().basePath("/api");

app.route("/auth", authRoutes);

export const GET = handle(app);
export const POST = handle(app);
