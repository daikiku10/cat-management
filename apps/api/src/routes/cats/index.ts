import { Hono } from "hono";
import { requireAuth } from "@/lib/middleware/auth";
import type { HonoEnv } from "@/lib/types";
import { create } from "./create";
import { list } from "./list";
import { detail } from "./detail";
import { update } from "./update";
import { deleteCat } from "./delete";

const catRoutes = new Hono<HonoEnv>();

catRoutes.use("*", requireAuth);

catRoutes.route("/", create);
catRoutes.route("/", list);
catRoutes.route("/", detail);
catRoutes.route("/", update);
catRoutes.route("/", deleteCat);

export { catRoutes };
