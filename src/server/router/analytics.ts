import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const analyticsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
      ctx: {
        ...ctx,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .query("get-analytics", {
    async resolve({ ctx }) {
      return await ctx.prisma.analytics.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          clicks: true,
          views: true,
        },
      });
    },
  })
  .query("get-user-info", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          name: true,
          image: true,
        },
      });
    },
  });
