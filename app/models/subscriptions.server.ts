import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import {
  plans,
  subscriptions,
  type SelectPlans,
  type Subscription,
  type SubscriptionCreate,
  type SubscriptionUpdate,
} from "drizzle/schema";

import { serviceDb } from "~/utils/db.server";

export const SubscriptionsModel = {
  upsertOnLSId: async (
    subscription: Omit<SubscriptionCreate, "id">,
  ): Promise<Subscription> => {
    return await serviceDb()
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
    return await serviceDb()
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.organizationId, organizationId))
      .limit(1)
      .get();
  },

  getByIdAndOrgId: async (
    id: string,
    organizationId: string,
  ): Promise<Subscription | undefined> => {
    return await serviceDb()
      .select()
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.id, id),
          eq(subscriptions.organizationId, organizationId),
        ),
      )
      .limit(1)
      .get();
  },

  getById: async (
    id: string,
  ): Promise<(Subscription & { plan: SelectPlans }) | undefined> => {
    const res = await serviceDb()
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.id, id))
      .innerJoin(plans, eq(subscriptions.planId, plans.id))
      .limit(1)
      .get();
    if (!res) return;
    const { subscription: sub, plans: resPlans } = res;
    return { ...sub, plan: resPlans };
  },

  update: async (id: string, subscription: SubscriptionUpdate) => {
    return await serviceDb()
      .update(subscriptions)
      .set(subscription)
      .where(eq(subscriptions.id, id));
  },
};
