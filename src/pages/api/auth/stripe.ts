import stripeServer from "@shared/third-party/stripe/server";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "./[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { query } = req;
  const { code } = query;

  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session)
    return res.redirect(
      new URL("/sign-in", `http://${req.headers.host}`).toString()
    );

  res.redirect(
    new URL("/settings/account", `http://${req.headers.host}`).toString()
  );

  if (!code || typeof code !== "string") return res;

  const result = await stripeServer.oauth
    .token({
      grant_type: "authorization_code",
      code: code,
    })
    .catch((err: any) => {
      throw new Error(err.message);
    });

  console.log(result);
  return res;
}
