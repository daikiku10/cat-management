import { createLogRoutes } from "@/lib/log-routes";
import { createPoopLogSchema } from "@/lib/validators/log";
import { poopLogs } from "@repo/db";

const poopLogRoutes = createLogRoutes({
  path: "poop-logs",
  table: poopLogs,
  createSchema: createPoopLogSchema,
  resourceKey: "poopLogs",
  resourceLabel: "うんち記録",
});

export { poopLogRoutes };
