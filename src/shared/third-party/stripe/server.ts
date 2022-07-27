import Stripe from "stripe";
import { STRIPE_CLIENT_SECRET } from "../../../../env";

const stripeServer = new Stripe(STRIPE_CLIENT_SECRET!, {
  apiVersion: "2020-08-27",
});

export default stripeServer;
