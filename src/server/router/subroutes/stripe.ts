import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../context";

export const stripeRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (!ctx.req) {
      throw new TRPCError({ code: "BAD_REQUEST" });
    }

    return next({
      ctx: {
        ...ctx,
        req: ctx.req,
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  })
  .mutation("onboard", {
    input: z.object({
      id: z.string(),
    }),
    async resolve({ ctx, input }) {
      const account = await ctx.stripe.accounts.create({
        type: "custom",
        country: "FR",
        email: ctx.session?.user?.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        account_token: input.id,
      });

      return await ctx.stripe.accountLinks.create({
        refresh_url: new URL(
          "/settings/account",
          `http://${ctx.req.headers.host}`
        ).toString(),
        return_url: new URL(
          "/api/stripe/account",
          `http://${ctx.req.headers.host}`
        ).toString(),
        type: "account_onboarding",
        account: account.id,
        collect: "eventually_due",
      });
    },
  });
