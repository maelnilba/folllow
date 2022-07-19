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
import type { Prisma } from "@prisma/client";
import { nanoid } from "nanoid";

const s3 = new aws.S3({
  accessKeyId: APP_AWS_ACCESS_KEY,
  secretAccessKey: APP_AWS_SECRET_KEY,
  region: APP_AWS_REGION,
  signatureVersion: "v4",
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
          userId: true,
        },
        where: {
          slug: input.slug,
        },
      });

      if (data && data.userId !== ctx.session?.user?.id) {
        issues.slug(`Slug ${input.slug} already exists.`);
      }
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
          imageKey: true,
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
      slug: z
        .string()
        .min(3)
        .max(20)
        .regex(/^@/, { message: "Must start with a @" }),
      bio: z.string().max(200).optional(),
      theme: z.enum(Themes),
      imageKey: z.string().optional(),
      image: z
        .string()
        .transform(
          (arg) =>
            `https://${AWS_S3_BUCKET_NAME}.s3.${APP_AWS_REGION}.amazonaws.com/${arg}`
        )
        .optional(),
      links: z
        .array(
          z.object({
            position: z.number().nonnegative(),
            id: z.string(),
            media: z.enum(SocialMedias),
            url: z.string().min(1).max(160),
          })
        )
        .transform((arg) => arg.sort((a, b) => a.position - b.position))
        .transform((arg) => arg as Prisma.JsonArray)
        .optional(),
      ads_enabled: z.boolean(),
    }),
    async resolve({ input, ctx }) {
      return await ctx.prisma.tree.update({
        data: {
          ...input,
        },
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          slug: true,
          links: true,
          bio: true,
          theme: true,
          imageKey: true,
          image: true,
          ads_enabled: true,
        },
      });
    },
  })
  .mutation("get-presigned-post", {
    input: z.object({
      previousKey: z.string().nullable(),
    }),
    resolve({ input, ctx }) {
      if (input.previousKey) {
        s3.deleteObject(
          {
            Bucket: AWS_S3_BUCKET_NAME,
            Key: input.previousKey,
          },
          (err) => {
            console.log(err);
          }
        );
      }
      const key = nanoid();
      const post = s3.createPresignedPost({
        Bucket: AWS_S3_BUCKET_NAME,
        Fields: {
          key: key,
        },
        Expires: 60, // seconds
        Conditions: [
          ["content-length-range", 0, 5048576 * 2], // up to 2 MB
        ],
      });

      return { key, post };
    },
  });
