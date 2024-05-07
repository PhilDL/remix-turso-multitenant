import { z } from "zod";

export const EventsSchema = z.enum([
  "order_created",
  "order_refunded",
  "subscription_created",
  "subscription_updated",
  "subscription_cancelled",
  "subscription_resumed",
  "subscription_expired",
  "subscription_paused",
  "subscription_unpaused",
  "subscription_payment_success",
  "subscription_payment_failed",
  "subscription_payment_recovered",
  "subscription_payment_refunded",
  "license_key_created",
  "license_key_updated",
]);

export const AttributesSchema = z.object({
  store_id: z.number(),
  url: z.string(),
  events: z.array(EventsSchema),
  last_sent_at: z.string().optional(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
  test_mode: z.boolean(),
});

export const MetadataSchema = z.object({
  meta: z.object({
    event_name: z.string(),
    custom_data: z.object({
      org_id: z.string(),
    }),
  }),
});

export const EventBodyWithData = z
  .object({
    data: z.object({
      attributes: z
        .object({
          first_subscription_item: z.object({
            id: z.number(),
            price_id: z.number(),
            is_usage_based: z.boolean(),
          }),
        })
        .and(z.record(z.string(), z.unknown())),
      id: z.string(),
    }),
  })
  .merge(MetadataSchema);
