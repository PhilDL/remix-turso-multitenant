import {
  createCheckout,
  getProduct,
  lemonSqueezySetup,
  listPrices,
  listProducts,
  Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { createId } from "@paralleldrive/cuid2";
import { NewPlan, plans } from "drizzle/schema";

import { env } from "~/env.server";
import { buildDbClient } from "./db.server";

export const configureLemonSqueezy = () => {
  lemonSqueezySetup({
    apiKey: env.LEMONSQUEEZY_API_KEY,
    onError: (error) => {
      // eslint-disable-next-line no-console -- allow logging
      console.error(error);
      throw new Error(`Lemon Squeezy API error: ${error.message}`);
    },
  });
};

export const upsertPlan = async (plan: NewPlan) => {
  await buildDbClient()
    .insert(plans)
    .values(plan)
    .onConflictDoUpdate({ target: plans.variantId, set: plan });
};

export const syncSubscriptionPlans = async () => {
  configureLemonSqueezy();
  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  });
  console.log(products.data?.data?.map((p) => p.attributes));

  const allVariants = products.data?.included as Variant["data"][] | undefined;
  if (!allVariants) {
    throw new Error("No variants found in Lemon Squeezy");
  }

  for (const v of allVariants) {
    const variant = v.attributes;

    // Skip draft variants or if there's more than one variant, skip the default
    // variant. See https://docs.lemonsqueezy.com/api/variants
    if (
      variant.status === "draft" ||
      (allVariants.length !== 1 && variant.status === "pending")
    ) {
      // `return` exits the function entirely, not just the current iteration.
      continue;
    }

    // Fetch the Product name.
    const productName =
      (await getProduct(variant.product_id)).data?.data.attributes.name ?? "";

    // Fetch the Price object.
    const variantPriceObject = await listPrices({
      filter: {
        variantId: v.id,
      },
    });

    const currentPriceObj = variantPriceObject.data?.data.at(0);
    const isUsageBased = currentPriceObj?.attributes.usage_aggregation !== null;
    const interval = currentPriceObj?.attributes.renewal_interval_unit;
    const intervalCount = currentPriceObj?.attributes.renewal_interval_quantity;
    const trialInterval = currentPriceObj?.attributes.trial_interval_unit;
    const trialIntervalCount =
      currentPriceObj?.attributes.trial_interval_quantity;

    const price = isUsageBased
      ? currentPriceObj?.attributes.unit_price_decimal
      : currentPriceObj.attributes.unit_price;

    const priceString = price !== null ? price?.toString() ?? "" : "";

    const isSubscription =
      currentPriceObj?.attributes.category === "subscription";

    // If not a subscription, skip it.
    if (!isSubscription) {
      continue;
    }

    await upsertPlan({
      id: createId(),
      name: variant.name,
      description: variant.description,
      price: priceString,
      interval,
      intervalCount,
      isUsageBased,
      productId: String(variant.product_id),
      productName,
      variantId: v.id,
      trialInterval,
      trialIntervalCount,
      sort: variant.sort,
    });
  }
  return await buildDbClient().query.plans.findMany();
};

export const createCheckoutURL = async (
  planId: string,
  {
    embed = false,
    userId,
    email,
  }: { userId?: string; embed?: boolean; email?: string },
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
        user_id: userId,
      },
    },
    productOptions: {
      enabledVariants: [Number(planId)],
      redirectUrl: `${env.PUBLIC_APP_URL}/app/dashboard/`,
      receiptButtonText: "Go to Dashboard",
      receiptThankYouNote: "Thank you for signing up to Tantilument",
    },
  });

  return checkout.data?.data.attributes.url;
};
