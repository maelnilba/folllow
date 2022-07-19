import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import TwitterProvider from "next-auth/providers/twitter";
import DiscordProvider from "next-auth/providers/discord";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../server/db/client";
import {
  GITHUB_ID,
  GITHUB_SECRET,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_CLIENT_SECRET,
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
} from "../../../../env";
// https://github.com/ndom91/next-auth-example-sign-in-page
export const authOptions: NextAuthOptions = {
  debug: true,
  pages: {
    signIn: "/sign-in",
    newUser: "/dashboard",
    error: "/auth/error",
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: GITHUB_ID,
      clientSecret: GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    TwitterProvider({
      clientId: TWITTER_CLIENT_ID!,
      clientSecret: TWITTER_CLIENT_SECRET!,
      version: "2.0",
    }),
    DiscordProvider({
      clientId: DISCORD_CLIENT_ID!,
      clientSecret: DISCORD_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
};

export default NextAuth(authOptions);
