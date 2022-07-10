import { createRouter } from "./context";
import { z } from "zod";
import { SocialMedias, Themes } from "../../utils/shared";
import type { SocialMediaLink } from "../../utils/shared";
import { TRPCError } from "@trpc/server";

type getTreeJsonType = {
  links: [SocialMediaLink];
  bio: string;
  theme: string;
  image: string;
} | null;

const mediaRegex = new RegExp(SocialMedias.join("|"), "gi");
const themeRegex = new RegExp(Themes.join("|"), "gi");

export const treeRouter = createRouter()
  .query("getLinkTree", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.tree.findUnique({
        where: {
          slug: input.slug,
        },
        select: {
          links: true,
          bio: true,
          theme: true,
          image: true,
        },
      });
    },
  })
  .query("checkSlug", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.tree.findUniqueOrThrow({
        select: {
          slug: true,
        },
        where: {
          slug: input.slug,
        },
      });
    },
  })
  .middleware(async ({ ctx, next }) => {
    if (!ctx.session) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    if (!ctx.session.user) {
      throw new TRPCError({ code: "NOT_FOUND" });
    }
    return next();
  })
  .query("getMyTree", {
    async resolve({ ctx }) {
      // Which one is the best pratices to have ?
      // const data = await ctx.prisma.user.findFirst({
      //   where: {
      //     id: ctx.session!.user!.id,
      //   },
      //   select: {
      //     tree: {
      //       select: {
      //         slug: true,
      //         links: true,
      //         bio: true,
      //         theme: true,
      //         image: true,
      //       },
      //     },
      //   },
      // });
      return await ctx.prisma.tree.findUnique({
        where: {
          userId: ctx.session!.user!.id,
        },
        select: {
          slug: true,
          links: true,
          bio: true,
          theme: true,
          image: true,
        },
      });
    },
  })
  .mutation("createTree", {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.tree.create({
        data: {
          slug: input.slug,
          userId: ctx.session!.user!.id,
        },
      });
    },
  })
  .mutation("postTree", {
    input: z.object({
      slug: z.string().optional(),
      bio: z.string().optional(),
      theme: z.string().regex(themeRegex).optional(),
      image: z.string().optional(),
      links: z
        .object({
          id: z.number(),
          media: z.string().regex(mediaRegex),
          url: z.string(),
        })
        .optional(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.tree.update({
        data: {
          ...input,
        },
        where: {
          userId: ctx.session!.user!.id,
        },
      });
    },
  });
