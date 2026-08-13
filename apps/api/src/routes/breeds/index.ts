import { Hono } from "hono";
import { requireAuth } from "@/lib/middleware/auth";
import type { HonoEnv } from "@/lib/types";
import { list } from "./list";

const breedRoutes = new Hono<HonoEnv>();

breedRoutes.use("*", requireAuth);

breedRoutes.route("/", list);

export { breedRoutes };
