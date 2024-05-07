import { Suspense } from "react";
import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { Await, useLoaderData } from "@remix-run/react";
import { type NewPlan } from "drizzle/schema";
import type { ExternalScriptsHandle } from "remix-utils/external-scripts";

import { requireUserOrg } from "~/utils/auth.server";
import { PlansModel } from "~/models/plans.server";
import { SignupButton } from "~/components/subscription-button";
import { buttonVariants } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { cn } from "~/utils";

export let handle: ExternalScriptsHandle = {
  scripts: [
    {
      src: "https://app.lemonsqueezy.com/js/lemon.js",
      defer: true,
      preload: true,
    },
  ],
};

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { user, org } = await requireUserOrg(request, params);
  return defer({
    plans: PlansModel.getAll(),
    user,
    org,
  });
};

export default function Dashboard() {
  const { plans, org } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Dashboard for {org.name}
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
                  <Plan
                    plan={plan}
                    key={plan.id}
                    orgSlug={org.slug}
                    orgPlanId={org.planId}
                  />
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

export const Plan = ({
  plan,
  orgSlug,
  orgPlanId,
}: {
  plan: NewPlan;
  orgSlug: string;
  orgPlanId?: string | null;
}) => {
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

      <CardFooter className="flex w-full">
        {orgPlanId === plan.id ? (
          <div
            className={cn(buttonVariants({ variant: "secondary" }), "w-full")}
            aria-disabled="true"
          >
            Current Plan
          </div>
        ) : (
          <SignupButton plan={plan} orgSlug={orgSlug} />
        )}
      </CardFooter>
    </Card>
  );
};
