import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import type { NewPlan } from "drizzle/schema";

import { requireUserOrg } from "~/utils/auth.server";
import { PlansModel } from "~/models/plans.server";
import { SubscriptionsModel } from "~/models/subscriptions.server";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";
import { cn, formatPrice } from "~/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { user, org } = await requireUserOrg(request, params);
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

export default function ChangePlan() {
  const navigate = useNavigate();
  const { plans, org } = useLoaderData<typeof loader>();
  return (
    <Dialog
      defaultOpen={true}
      onOpenChange={(open) =>
        !open
          ? navigate("..", {
              replace: true,
              preventScrollReset: true,
            })
          : null
      }
    >
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Change your plan</DialogTitle>
          <DialogDescription>
            Here you can change your subscription plan.
          </DialogDescription>
        </DialogHeader>
        <div className="mb-5 mt-4 grid max-w-3xl grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5">
          {plans.map((plan) => (
            <Plan
              plan={plan}
              key={plan.id}
              orgSlug={org.slug}
              orgPlanId={org.planId}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
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
        <CardTitle className="text-xl">{productName}</CardTitle>
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
