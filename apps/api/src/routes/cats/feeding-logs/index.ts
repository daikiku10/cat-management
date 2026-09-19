import { createLogRoutes } from "@/lib/log-routes";
import { createFeedingLogSchema } from "@/lib/validators/log";
import { feedingLogs } from "@repo/db";

const feedingLogRoutes = createLogRoutes({
  path: "feeding-logs",
  table: feedingLogs,
  createSchema: createFeedingLogSchema,
  resourceKey: "feedingLogs",
  resourceLabel: "食事記録",
});

export { feedingLogRoutes };
