import { createId } from "@paralleldrive/cuid2";
import { eq } from "drizzle-orm";
import { plans, type NewPlan, type SelectPlans } from "drizzle/schema";

import { buildDbClient } from "~/utils/db.server";

export const PlansModel = {
  getById: async (id: string): Promise<SelectPlans | undefined> => {
    return await buildDbClient()
      .select()
      .from(plans)
      .where(eq(plans.id, id))
      .limit(1)
      .get();
  },

  getByVariantId: async (
    variantId: string,
  ): Promise<SelectPlans | undefined> => {
    return await buildDbClient()
      .select()
      .from(plans)
      .where(eq(plans.variantId, variantId))
      .limit(1)
      .get();
  },

  upsert: async (plan: Omit<NewPlan, "id">): Promise<SelectPlans> => {
    return await buildDbClient()
      .insert(plans)
      .values({
        ...plan,
        id: createId(),
      })
      .onConflictDoUpdate({ target: plans.variantId, set: plan })
      .returning()
      .get();
  },
};
