import {
  cancelSubscription,
  createCheckout,
  createWebhook,
  getPrice,
  getProduct,
  lemonSqueezySetup,
  listPrices,
  listProducts,
  listWebhooks,
  type Variant,
} from "@lemonsqueezy/lemonsqueezy.js";
import { type WebhookEvent } from "drizzle/schema";

import { PlansModel } from "~/models/plans.server";
import { SubscriptionsModel } from "~/models/subscriptions.server";
import { WebhookEventsModel } from "~/models/webhook-events.server";
import { env } from "~/env.server";
import { EventBodyWithData, EventsSchema } from "./lemonsqueezy.schema";

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

export const syncSubscriptionPlans = async () => {
  configureLemonSqueezy();
  const products = await listProducts({
    filter: { storeId: process.env.LEMONSQUEEZY_STORE_ID },
    include: ["variants"],
  });

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

    await PlansModel.upsert({
      name: variant.name,
      description: variant.description,
      price: priceString,
      interval,
      intervalCount,
      isUsageBased,
      productId: String(variant.product_id),
      productName,
      variantId: String(v.id),
      trialInterval,
      trialIntervalCount,
      sort: variant.sort,
    });
  }
  return await PlansModel.getAll();
};

export const createCheckoutURL = async (
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
  console.log(checkout.data?.data.attributes);

  return checkout.data?.data.attributes.url;
};

export async function getPublishedWebhooks({
  testMode = true,
}: {
  testMode: boolean;
}) {
  configureLemonSqueezy();
  const allWebhooks = await listWebhooks({
    filter: { storeId: env.LEMONSQUEEZY_STORE_ID },
  });
  const url = new URL(
    "resources/lemonsqueezy/webhook",
    env.PUBLIC_APP_URL,
  ).toString();
  const webhook = allWebhooks.data?.data.find(
    (wh) => wh.attributes.url === url && wh.attributes.test_mode === testMode,
  );

  return webhook;
}

export async function setupWebhook({ testMode = true }: { testMode: boolean }) {
  configureLemonSqueezy();

  const webhookURL = new URL(
    "resources/lemonsqueezy/webhook",
    env.PUBLIC_APP_URL,
  ).toString();

  const existingWebhooks = await getPublishedWebhooks({ testMode });
  if (existingWebhooks) {
    console.log("Webhook already exists on Lemon Squeezy.");
    return existingWebhooks;
  }

  const newWebhook = await createWebhook(env.LEMONSQUEEZY_STORE_ID, {
    secret: env.LEMONSQUEEZY_WEBHOOK_SECRET,
    url: webhookURL,
    testMode,
    events: [
      "subscription_created",
      "subscription_expired",
      "subscription_updated",
    ],
  });

  return newWebhook.data?.data;
}

export async function processWebhookEvent(webhookEvent: WebhookEvent) {
  configureLemonSqueezy();

  let processingError = "";
  const parsedEventBody = EventBodyWithData.passthrough().safeParse(
    webhookEvent.body,
  );
  const eventName = EventsSchema.parse(webhookEvent.eventName);

  if (parsedEventBody.success === false) {
    return await WebhookEventsModel.update({
      ...webhookEvent,
      processed: true,
      processingError: "Invalid event body.",
    });
  }
  const eventBody = parsedEventBody.data;
  console.log("Processing event", eventName, eventBody);
  switch (eventName) {
    case "subscription_created":
    case "subscription_updated":
    case "subscription_expired":
    case "subscription_cancelled":
    case "subscription_paused":
    case "subscription_unpaused":
    case "subscription_resumed":
      const attributes = eventBody.data.attributes;
      const variantId = String(attributes.variant_id);

      // We assume that the Plan table is up to date.
      const plan = await PlansModel.getByVariantId(variantId);
      if (!plan) {
        processingError = `Plan with variantId ${variantId} not found.`;
        console.error(processingError);
        break;
      }

      // Update the subscription in the database.

      const priceId = attributes.first_subscription_item.price_id;

      // Get the price data from Lemon Squeezy.
      const priceData = await getPrice(priceId);
      if (priceData.error) {
        processingError = `Failed to get the price data for the subscription ${eventBody.data.id}.`;
      }

      const isUsageBased = attributes.first_subscription_item.is_usage_based;
      const price = isUsageBased
        ? priceData.data?.data.attributes.unit_price_decimal
        : priceData.data?.data.attributes.unit_price;
      const lemonSqueezyId = eventBody.data.id;

      // Create/update subscription in the database.
      try {
        await SubscriptionsModel.upsertOnLSId({
          lemonSqueezyId,
          orderId: attributes.order_id as number,
          name: attributes.user_name as string,
          email: attributes.user_email as string,
          status: attributes.status as string,
          statusFormatted: attributes.status_formatted as string,
          renewsAt: attributes.renews_at as string,
          endsAt: attributes.ends_at as string,
          trialEndsAt: attributes.trial_ends_at as string,
          price: price?.toString() ?? "",
          isPaused: false,
          subscriptionItemId: String(attributes.first_subscription_item.id),
          isUsageBased: attributes.first_subscription_item.is_usage_based,
          organizationId: eventBody.meta.custom_data.org_id,
          planId: plan.id,
        });
      } catch (error) {
        processingError = `Failed to upsert Subscription #${lemonSqueezyId} to the database.`;
        console.error(error);
      }
      break;
    default:
      break;
  }
  return await WebhookEventsModel.update({
    ...webhookEvent,
    processed: true,
    processingError,
  });
}

export const cancelSub = async (id: string, orgId: string) => {
  configureLemonSqueezy();

  const subscription = await SubscriptionsModel.getByIdAndOrgId(id, orgId);

  if (!subscription) {
    throw new Error(`Subscription #${id} not found.`);
  }

  const cancelledSub = await cancelSubscription(subscription.lemonSqueezyId);

  if (cancelledSub.error) {
    throw new Error(cancelledSub.error.message);
  }

  // Update the db
  try {
    await SubscriptionsModel.update(subscription.id, {
      status: cancelledSub.data?.data.attributes.status,
      statusFormatted: cancelledSub.data?.data.attributes.status_formatted,
      endsAt: cancelledSub.data?.data.attributes.ends_at,
    });
  } catch (error) {
    throw new Error(`Failed to cancel Subscription #${id} in the database.`);
  }
  return cancelledSub;
};
