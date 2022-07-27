import { loadStripe } from "@stripe/stripe-js";

const stripeClient = async () =>
  await loadStripe(process.env.NEXT_PUBLIC_STRIPE_CLIENT_ID!);

export default stripeClient;
