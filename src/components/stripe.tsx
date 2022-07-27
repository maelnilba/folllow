// export const Stripe: React.FC = () => {
//   return (
//     <a
//       role="button"
//       className="btn btn-primary"
//       href={`https://dashboard.stripe.com/oauth/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_STRIPE_OAUTH_CLIENT_ID}&scope=read_write`}
//     >
//       Connect with stripe
//     </a>
//   );
// };

import stripeClient from "@shared/third-party/stripe/client";
import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "utils/trpc";

export const Stripe: React.FC = () => {
  const router = useRouter();
  const stripe = trpc.useMutation(["stripe.onboard"]);
  const handleSubmit = async () => {
    const s = await stripeClient();
    if (!s) return;
    const result = await s.createToken("account", {
      tos_shown_and_accepted: true,
    });

    if (result.error) console.log(result.error.message);
    if (!result.token) return;

    stripe.mutate(
      { id: result.token.id },
      {
        onSuccess(data) {
          console.log({ data });
          router.push(data.url);
        },
      }
    );
  };
  return (
    <button
      className="btn btn-primary normal-case"
      onClick={(event) => {
        event.stopPropagation();
        handleSubmit();
      }}
    >
      Connect with stripe
    </button>
  );
};
