// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./subroutes/auth";
import { treeRouter } from "./subroutes/tree";
import { pageRouter } from "./subroutes/page";
import { analyticsRouter } from "./subroutes/analytics";
import { dashboardRouter } from "./subroutes/dashboard";
import { stripeRouter } from "./subroutes/stripe";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("dashboard.", dashboardRouter)
  .merge("tree.", treeRouter)
  .merge("page.", pageRouter)
  .merge("analytics.", analyticsRouter)
  .merge("stripe.", stripeRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
