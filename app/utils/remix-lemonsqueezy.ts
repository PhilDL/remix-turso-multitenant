import {
  createCheckout,
  lemonSqueezySetup,
} from "@lemonsqueezy/lemonsqueezy.js";

export type LSEnv = {
  LEMONSQUEEZY_API_KEY: string;
  LEMONSQUEEZY_STORE_ID: string;
  PUBLIC_APP_URL: string;
};

export const RemixLemonSqueezy = (
  env: LSEnv,
  options?: { onError?: (error: Error) => void },
) => {
  const configureLemonSqueezy = () =>
    lemonSqueezySetup({
      apiKey: env.LEMONSQUEEZY_API_KEY,
      onError: options?.onError,
    });
  return {
    createCheckoutURL: async (
      planId: string,
      {
        embed = true,
        orgId,
        email,
      }: { orgId?: string; embed?: boolean; email?: string },
    ) => {
      configureLemonSqueezy();

      const checkout = await createCheckout(env.LEMONSQUEEZY_STORE_ID, planId, {
        checkoutOptions: {
          embed,
          media: false,
          logo: !embed,
        },
        checkoutData: {
          email: email ?? undefined,
          custom: {
            org_id: orgId,
          },
        },
        productOptions: {
          enabledVariants: [Number(planId)],
          redirectUrl: `${env.PUBLIC_APP_URL}/app/dashboard/`,
          receiptButtonText: "Go to Dashboard",
          receiptThankYouNote: "Thank you for signing up to Multenant",
        },
      });
      return checkout.data?.data.attributes.url;
    },
  };
};
