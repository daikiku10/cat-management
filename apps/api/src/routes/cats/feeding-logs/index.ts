import { Hono } from "hono";
import type { HonoEnv } from "@/lib/types";
import { create } from "./create";
import { list } from "./list";
import { update } from "./update";
import { deleteFeedingLog } from "./delete";

const feedingLogRoutes = new Hono<HonoEnv>();

feedingLogRoutes.route("/", create);
feedingLogRoutes.route("/", list);
feedingLogRoutes.route("/", update);
feedingLogRoutes.route("/", deleteFeedingLog);

export { feedingLogRoutes };
