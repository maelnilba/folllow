import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "../context";

export const authRouter = createRouter().query("getSession", {
  resolve({ ctx }) {
    return ctx.session;
  },
});
