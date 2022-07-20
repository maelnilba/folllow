// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { authRouter } from "./auth";
import { treeRouter } from "./tree";
import { pageRouter } from "./page";
import { analyticsRouter } from "./analytics";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("auth.", authRouter)
  .merge("tree.", treeRouter)
  .merge("page.", pageRouter)
  .merge("analytics.", analyticsRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
