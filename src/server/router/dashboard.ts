import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const dashboardRouter = createRouter()
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
  .query("get-user-info", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findFirst({
        select: {
          name: true,
          image: true,
        },
        where: {
          id: ctx.session.user.id,
        },
      });
    },
  })
  .query("get-dashboard", {
    async resolve({ ctx }) {
      const now = new Date();
      const firstDayOfLastMonth = new Date(
        now.getFullYear(),
        now.getMonth() - 1,
        1
      );
      return await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session.user.id,
        },
        select: {
          tree: {
            select: {
              slug: true,
              image: true,
              bio: true,
            },
          },
          analytics: {
            include: {
              views: {
                where: {
                  created_at: {
                    gte: firstDayOfLastMonth,
                  },
                },
              },
              clicks: {
                where: {
                  created_at: {
                    gte: firstDayOfLastMonth,
                  },
                },
              },
            },
          },
          withdraw: true,
        },
      });
    },
  });
