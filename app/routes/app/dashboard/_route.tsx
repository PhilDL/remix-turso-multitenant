import { Suspense } from "react";
import { defer, LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { type NewPlan } from "drizzle/schema";
import { ExternalScriptsHandle } from "remix-utils/external-scripts";

import { requireUserId } from "~/utils/auth.server";
import { syncSubscriptionPlans } from "~/utils/lemonsequeezy.server";
import { SignupButton } from "~/components/subscription-button";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export let handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: "https://app.lemonsqueezy.com/js/lemon.js",
      defer: true,
      preload: true,
    },
  ],
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  await requireUserId(request);
  return defer({ plans: syncSubscriptionPlans() });
};

export default function Dashboard() {
  const { plans } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Dashboard
      </h2>
      <Suspense
        fallback={
          <div className="grid w-full items-center gap-5">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        }
      >
        <Await
          resolve={plans}
          errorElement={
            <div className="text-destructive-foreground">
              Error loading the plans
            </div>
          }
        >
          {(plans) => (
            <div>
              <h3 className="text-2xl font-semibold">Plans</h3>
              <div className="mb-5 mt-3 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
                {plans.map((plan) => (
                  <Plan plan={plan} key={plan.id} />
                ))}
              </div>
            </div>
          )}
        </Await>
      </Suspense>
    </div>
  );
}

export function formatPrice(priceInCents: string) {
  const price = parseFloat(priceInCents);
  const dollars = price / 100;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "EUR",
    // Use minimumFractionDigits to handle cases like $59.00 -> $59
    minimumFractionDigits: dollars % 1 !== 0 ? 2 : 0,
  }).format(dollars);
}

export const Plan = ({ plan }: { plan: NewPlan }) => {
  const { description, productName, name, price } = plan;

  return (
    <Card className="max-w-sm">
      <CardHeader>
        <CardTitle>{productName}</CardTitle>
        <CardDescription>({name})</CardDescription>
      </CardHeader>
      <CardContent>
        {description ? (
          <div
            dangerouslySetInnerHTML={{
              // Ideally sanitize the description first.
              __html: description,
            }}
          ></div>
        ) : null}
        <div>
          <span className="mr-0.5 text-xl text-accent-foreground">
            {formatPrice(price)}
          </span>
          {!plan.isUsageBased && plan.interval ? ` per ${plan.interval}` : null}
          {plan.isUsageBased && plan.interval
            ? ` /unit per ${plan.interval}`
            : null}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <SignupButton plan={plan} />
      </CardFooter>
    </Card>
  );
};
