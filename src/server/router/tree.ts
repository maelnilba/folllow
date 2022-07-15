import { createRouter } from "./context";
import { z } from "zod";
import { SocialMedias, Themes } from "../../utils/shared";
import { TRPCError } from "@trpc/server";
import { createCustomIssues } from "react-zorm";
import aws from "aws-sdk";
import {
  APP_AWS_ACCESS_KEY,
  APP_AWS_REGION,
  APP_AWS_SECRET_KEY,
  AWS_S3_BUCKET_NAME,
} from "../../../env";

const s3 = new aws.S3({
  accessKeyId: APP_AWS_ACCESS_KEY,
  secretAccessKey: APP_AWS_SECRET_KEY,
  region: APP_AWS_REGION,
});

aws.config.update({
  accessKeyId: APP_AWS_ACCESS_KEY,
  secretAccessKey: APP_AWS_SECRET_KEY,
  region: APP_AWS_REGION,
  signatureVersion: "v4",
});

const createTreeSchema = z.object({
  slug: z.string().min(3).max(20).regex(/^@/),
});

export const treeRouter = createRouter()
  .query("get-link-tree", {
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
  .mutation("check-slug", {
    input: z.object({
      slug: z.string().min(3).max(20).regex(/^@/),
    }),
    async resolve({ input, ctx }) {
      const issues = createCustomIssues(createTreeSchema);

      const data = await ctx.prisma.tree.findUnique({
        select: {
          slug: true,
        },
        where: {
          slug: input.slug,
        },
      });

      if (data) issues.slug(`Slug ${input.slug} already exists.`);

      return { issues: issues.toArray() };
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
  .query("get-my-tree", {
    async resolve({ ctx }) {
      return await ctx.prisma.tree.findUnique({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          slug: true,
          links: true,
          bio: true,
          theme: true,
          image: true,
          ads_enabled: true,
        },
      });
    },
  })
  .mutation("create-tree", {
    input: z.object({
      slug: z.string().min(3).max(20).regex(/^@/),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.tree.create({
        data: {
          slug: input.slug,
          userId: ctx.session.user.id,
        },
      });
    },
  })

  .mutation("post-tree", {
    input: z.object({
      slug: z.string().optional(),
      bio: z.string().optional(),
      theme: z.enum(Themes).optional(),
      image: z.string().optional(),
      links: z
        .array(
          z.object({
            id: z.number().nonnegative(),
            media: z.enum(SocialMedias),
            url: z.string().min(1),
          })
        )
        .optional(),
      ads_enabled: z.boolean().optional(),
    }),
    async resolve({ input, ctx }) {
      // Should convert links to JSON for prisma
      return await ctx.prisma.tree.update({
        data: {
          slug: input.slug,
          theme: input.theme,
          bio: input.bio,
          //links,
          ads_enabled: input.ads_enabled,
        },
        where: {
          userId: ctx.session.user.id,
        },
      });
    },
  })
  .mutation("get-presigned-post", {
    input: z.object({
      filename: z.string(),
    }),
    resolve({ input }) {
      const key = input.filename; // should nanoid or userId this thing
      const post = s3.createPresignedPost({
        Bucket: AWS_S3_BUCKET_NAME,
        Fields: {
          key,
        },
        Expires: 60, // seconds
        Conditions: [
          ["content-length-range", 0, 5048576], // up to 1 MB
        ],
      });

      return { key, post };
    },
  });
