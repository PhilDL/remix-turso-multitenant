import type { Subscription as LemonSqueezySubscription } from "@lemonsqueezy/lemonsqueezy.js";
import { Link, useFetcher, useNavigation } from "@remix-run/react";
import type { SelectPlans, Subscription } from "drizzle/schema";
import {
  BanIcon,
  CreditCardIcon,
  LoaderCircleIcon,
  MoreHorizontal,
  PauseIcon,
  SquareUserRoundIcon,
  TrashIcon,
} from "lucide-react";

import { appLink } from "~/utils/app-link";
import { AppLink } from "~/components/app-link";
import { SubscriptionDate } from "~/components/subscription-card/date";
import { SubscriptionStatus } from "~/components/subscription-card/status";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { cn, formatPrice } from "~/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export type SubscriptionCardProps = {
  subscription: Subscription & { plan: SelectPlans };
  org: {
    id: string;
    slug: string;
  };
};

export type SubscriptionStatusType =
  LemonSqueezySubscription["data"]["attributes"]["status"];

export function isValidSubscription(status: SubscriptionStatusType) {
  return status !== "cancelled" && status !== "expired" && status !== "unpaid";
}

export const SubscriptionCard = ({
  subscription,
  org,
}: SubscriptionCardProps) => {
  let formattedPrice = formatPrice(subscription.price);
  if (subscription.plan.isUsageBased) {
    formattedPrice += "/unit";
  }
  const formattedIntervalCount =
    subscription.plan.intervalCount && subscription.plan.intervalCount !== 1
      ? `every ${subscription.plan.intervalCount} `
      : "every";
  const navigation = useNavigation();
  const fetcher = useFetcher();

  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-4 px-2 py-3 text-sm lg:flex-nowrap">
      <div className="flex flex-col gap-2">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
            <h2
              className={cn(
                "text-surface-900 text-lg",
                !isValidSubscription(
                  subscription.status as SubscriptionStatusType,
                ) && "text-inherit",
              )}
            >
              {subscription.plan.productName} ({subscription.plan.name})
            </h2>
          </div>
        </header>
        <div className="flex flex-wrap items-center gap-2">
          {!subscription.endsAt && (
            <p>{`${formattedPrice} ${formattedIntervalCount} ${subscription.plan.interval}`}</p>
          )}
          <SubscriptionStatus
            status={subscription.status as SubscriptionStatusType}
            statusFormatted={subscription.statusFormatted}
            isPaused={Boolean(subscription.isPaused)}
          />

          {subscription.trialEndsAt ||
            (subscription.renewsAt && (
              <SubscriptionDate
                endsAt={subscription.endsAt}
                renewsAt={subscription.renewsAt}
                status={subscription.status as SubscriptionStatusType}
                trialEndsAt={subscription.trialEndsAt}
              />
            ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isValidSubscription(subscription.status as SubscriptionStatusType) && (
          <>
            <AppLink
              to={`/billing/change-plan`}
              className={buttonVariants({ variant: "secondary" })}
              prefetch="intent"
            >
              {navigation.state !== "idle" &&
                navigation.location.pathname.endsWith(
                  "billing/change-plan",
                ) && <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />}
              Change plan
            </AppLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <PauseIcon className="mr-2 h-4 w-4" /> Pause payments
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <CreditCardIcon className="mr-2 h-4 w-4" /> Update payment
                  method
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SquareUserRoundIcon className="mr-2 h-4 w-4" /> Customer
                  portal
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    to={appLink(
                      `/billing/subscriptions/${subscription.id}/cancel`,
                      org,
                    )}
                  >
                    <BanIcon className="mr-2 h-4 w-4" /> Cancel
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </div>
  );
};

export const NoSubscriptionCard = () => {
  const navigation = useNavigation();

  return (
    <div className="flex flex-row flex-wrap items-center justify-between gap-4 px-2 py-3 text-sm lg:flex-nowrap">
      <div className="flex flex-col gap-2">
        <header className="flex items-center justify-between gap-3">
          <div className="flex min-h-8 flex-wrap items-center gap-x-3 gap-y-1">
            <h2 className={cn("text-lg text-muted-foreground")}>
              Free (Basic free tier)
            </h2>
          </div>
        </header>
        <div className="flex flex-wrap items-center gap-2">
          <p>Free</p>
          <SubscriptionStatus
            status={"active" as SubscriptionStatusType}
            statusFormatted={"Active"}
            isPaused={false}
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isValidSubscription("active" as SubscriptionStatusType) && (
          <>
            <AppLink
              to={`/billing/change-plan`}
              className={buttonVariants({ variant: "secondary" })}
              prefetch="intent"
            >
              {navigation.state !== "idle" &&
                navigation.location.pathname.endsWith(
                  "billing/change-plan",
                ) && <LoaderCircleIcon className="mr-2 h-4 w-4 animate-spin" />}
              Upgrade
            </AppLink>
          </>
        )}
      </div>
    </div>
  );
};
