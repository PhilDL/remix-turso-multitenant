import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import {
  subscriptions,
  type Subscription,
  type SubscriptionCreate,
} from "drizzle/schema";

import { buildDbClient } from "~/utils/db.server";

export const SubscriptionsModel = {
  upsertOnLSId: async (
    subscription: Omit<SubscriptionCreate, "id">,
  ): Promise<Subscription> => {
    return await buildDbClient()
      .insert(subscriptions)
      .values({ ...subscription, id: createId() })
      .onConflictDoUpdate({
        target: subscriptions.lemonSqueezyId,
        set: subscription,
      })
      .returning()
      .get();
  },

  getByOrganizationId: async (
    organizationId: string,
  ): Promise<Subscription | undefined> => {
    return await buildDbClient()
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))
      .limit(1)
      .get();
  },
};
