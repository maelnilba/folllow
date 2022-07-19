import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const authRouter = createRouter()
  .query("getSession", {
    resolve({ ctx }) {
      return ctx.session;
    },
  })
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
              views: true,
              clicks: true,
            },
          },
          withdraw: true,
        },
      });
    },
  });
