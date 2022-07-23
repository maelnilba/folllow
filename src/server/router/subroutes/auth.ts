import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../context";

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
  .mutation("update-image", {
    async resolve({ ctx }) {
      console.log(ctx.session.user.image);
      return; //
    },
  })
  .query("get-account", {
    async resolve({ ctx }) {
      return await ctx.prisma.account.findMany({
        where: {
          userId: {
            equals: ctx.session.user.id,
          },
        },
        select: {
          provider: true,
        },
      });
    },
  });
