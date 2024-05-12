import type { LoaderFunctionArgs } from "@remix-run/node";

import { syncSubscriptionPlans } from "~/utils/lemonsequeezy.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await syncSubscriptionPlans();
  return new Response("Plans synced successfully.", { status: 200 });
};
