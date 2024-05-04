import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import {
  webhookEvents,
  type WebhookEvent,
  type WebhookEventCreate,
} from "drizzle/schema";

import { buildDbClient } from "~/utils/db.server";

export const WebhookEventModel = {
  create: async (
    data: Omit<WebhookEventCreate, "id">,
  ): Promise<WebhookEvent> => {
    return await buildDbClient()
      .insert(webhookEvents)
      .values({
        id: createId(),
        eventName: data.eventName,
        body: data.body,
        processed: false,
      })
      .onConflictDoNothing({ target: webhookEvents.id })
      .returning()
      .get();
  },

  update: async (
    data: Partial<WebhookEvent> & Pick<WebhookEvent, "id">,
  ): Promise<WebhookEvent> => {
    return await buildDbClient()
      .update(webhookEvents)
      .set(data)
      .where(eq(webhookEvents.id, data.id))
      .returning()
      .get();
  },
};
