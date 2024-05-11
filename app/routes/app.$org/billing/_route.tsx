import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet, useLoaderData } from "@remix-run/react";
import type { ExternalScriptsHandle } from "remix-utils/external-scripts";

import { PlansModel } from "~/models/plans.server";
import { SubscriptionsModel } from "~/models/subscriptions.server";
import {
  NoSubscriptionCard,
  SubscriptionCard,
} from "~/components/subscription-card";
import { UserAndOrgContext } from "~/middleware/require-user-and-org";

export let handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: "https://app.lemonsqueezy.com/js/lemon.js",
      defer: true,
      preload: true,
    },
  ],
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { user, org } = context.get(UserAndOrgContext);
  const subscription = org.planId
    ? await SubscriptionsModel.getById(org.subscriptionId!)
    : null;
  const plans = await PlansModel.getAll();
  return json({
    plans,
    user,
    org,
    subscription,
  });
};

export default function Billing() {
  const { subscription, org } = useLoaderData<typeof loader>();
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Billing
        </h2>
        <p className="text-md text-muted-foreground">
          Here you can handle your subscription and billing information.
        </p>
      </header>
      <section className="shadow-xs flex max-w-3xl flex-col divide-y divide-input rounded-lg border border-input px-4 py-2.5 text-sm">
        {subscription ? (
          <SubscriptionCard subscription={subscription} org={org} />
        ) : (
          <NoSubscriptionCard />
        )}
      </section>
      <Outlet />
    </div>
  );
}
