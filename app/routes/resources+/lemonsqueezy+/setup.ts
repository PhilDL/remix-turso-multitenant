import type { LoaderFunctionArgs } from "@remix-run/node";

import { setupWebhook } from "~/utils/lemonsequeezy.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  await setupWebhook({ testMode: true });
  return new Response("Webhook setup complete.", { status: 200 });
};
