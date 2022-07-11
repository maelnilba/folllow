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
    // Any queries or mutations after this middleware will
    // raise an error unless there is a current session
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!ctx.session.user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return next();
  })
  .query("get-user-info", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findFirst({
        select: {
          name: true,
          image: true,
        },
        where: {
          id: ctx.session!.user!.id,
        },
      });
    },
  })
  .query("get-dashboard", {
    async resolve({ ctx }) {
      return await ctx.prisma.user.findFirst({
        where: {
          id: ctx.session!.user!.id,
        },
        select: {
          tree: {
            select: {
              slug: true,
              image: true,
            },
          },
          analytics: true,
          withdraw: true,
        },
      });
    },
  })
  .query("getSecretMessage", {
    async resolve({ ctx }) {
      return "You are logged in and can see this secret message!";
    },
  });
