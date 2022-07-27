import stripeServer from "@shared/third-party/stripe/server";
import { NextApiRequest, NextApiResponse } from "next";
import { unstable_getServerSession as getServerSession } from "next-auth";
import { authOptions as nextAuthOptions } from "../auth/[...nextauth]";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  //
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session || !session.user) {
    return res.status(304).end();
  }
  const account = await stripeServer.accounts.create({
    type: "custom",
    country: "US",
    email: session?.user?.email || undefined,
    capabilities: {
      card_payments: { requested: true },
      transfers: { requested: true },
    },
  });

  const accountLink = await stripeServer.accountLinks.create({
    refresh_url: new URL(
      "/settings/account",
      `http://${req.headers.host}`
    ).toString(),
    return_url: new URL(
      "/api/stripe/account",
      `http://${req.headers.host}`
    ).toString(),
    type: "account_onboarding",
    account: account.id,
  });

  res.send({ url: accountLink.url });

  //   const paymentSettings = await prisma.payment.create({
  //     data: {
  //       platform: "Stripe",
  //       platform_user_id: account.id,
  //       userId: session.user.id,
  //     },
  //   });
}
