import crypto from "node:crypto";
import { type ActionFunctionArgs } from "@remix-run/node";

import { processWebhookEvent } from "~/utils/lemonsequeezy.server";
import { MetadataSchema } from "~/utils/lemonsqueezy.schema";
import { WebhookEventsModel } from "~/models/webhook-events.server";
import { env } from "~/env.server";

export const action = async ({ request, params }: ActionFunctionArgs) => {
  // First, make sure the request is from Lemon Squeezy.
  const rawBody = await request.text();

  const hmac = crypto.createHmac("sha256", env.LEMONSQUEEZY_WEBHOOK_SECRET);
  const digest = Buffer.from(hmac.update(rawBody).digest("hex"), "utf8");
  const signature = Buffer.from(
    request.headers.get("X-Signature") || "",
    "utf8",
  );

  if (!crypto.timingSafeEqual(digest, signature)) {
    throw new Error("Invalid signature.");
  }

  const requestData = MetadataSchema.passthrough().safeParse(
    JSON.parse(rawBody),
  );

  // Type guard to check if the object has a 'meta' property.
  if (requestData.success) {
    const webhookEvent = await WebhookEventsModel.create({
      eventName: requestData.data.meta.event_name,
      body: requestData.data,
    });

    // Non-blocking call to process the webhook event.
    void processWebhookEvent(webhookEvent);

    return new Response("OK", { status: 200 });
  }

  return new Response("Data invalid", { status: 400 });
};
