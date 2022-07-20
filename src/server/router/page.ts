import { TRPCError } from "@trpc/server";
import { timeFormat } from "d3-time-format";
import { NextApiRequest } from "next";
import { SocialMedias } from "utils/shared";
import { z } from "zod";
import { createRouter } from "./context";

const formatDate = timeFormat("%H, %B %d %Y"); // "18, June 30 2015"
const randomIp = () =>
  Math.floor(Math.random() * 255) +
  1 +
  "." +
  Math.floor(Math.random() * 255) +
  "." +
  Math.floor(Math.random() * 255) +
  "." +
  Math.floor(Math.random() * 255);

const getRequestIp = (req: NextApiRequest) => {
  if (process.env.NODE_ENV === "development") {
    return randomIp();
  }

  const forwarded = req.headers["x-forwarded-for"];

  const ip =
    typeof forwarded === "string"
      ? forwarded.split(/, /)[0]
      : req.socket.remoteAddress;

  return ip || randomIp();
};

const mutationPageSchema = z.object({ slug: z.string() });

export const pageRouter = createRouter()
  .middleware(async ({ ctx, next, rawInput }) => {
    const result = mutationPageSchema.safeParse(rawInput);
    if (!result.success) throw new TRPCError({ code: "BAD_REQUEST" });

    if (!ctx.req) {
      throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
    }
    const data = await ctx.prisma.tree.findFirst({
      where: {
        slug: result.data.slug,
      },
      select: {
        userId: true,
        slug: true,
      },
    });

    if (!data) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return next({
      ctx: {
        ...ctx,
        data: { ...data, requestIp: getRequestIp(ctx.req) },
      },
    });
  })
  .mutation("post-view", {
    input: z.object({
      slug: z.string(),
      has_adblock: z.boolean().default(false),
      geo: z
        .object({
          city: z.string().optional(),
          country: z.string().optional(),
        })
        .optional(),
    }),
    async resolve({ input, ctx }) {
      console.log("reach here", ctx.data.userId);
      await ctx.prisma.analytics.update({
        where: {
          userId: ctx.data.userId,
        },
        data: {
          totalViews: { increment: 1 },
          views: {
            create: {
              slug: ctx.data.slug,
              day: formatDate(new Date()),
              had_adblock: input.has_adblock,
              viewerIp: ctx.data.requestIp,
              from_country: input.geo?.country,
              from_city: input.geo?.city,
            },
          },
        },
        include: {
          views: true,
        },
      });

      return null;
    },
  })
  .mutation("post-click", {
    input: z.object({
      slug: z.string(),
      element: z.enum([...SocialMedias, "ad"]),
    }),
    async resolve({ input, ctx }) {
      if (!ctx.req) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
      const data = await ctx.prisma.tree.findFirst({
        where: {
          slug: input.slug,
        },
        select: {
          userId: true,
          slug: true,
        },
      });

      if (!data) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await ctx.prisma.analytics.update({
        where: {
          userId: data.userId,
        },
        data: {
          clicks: {
            create: {
              slug: data.slug,
              day: formatDate(new Date()),
              viewerIp: ctx.data.requestIp,
              element: input.element,
            },
          },
        },
        include: {
          clicks: true,
        },
      });

      return null;
    },
  });
