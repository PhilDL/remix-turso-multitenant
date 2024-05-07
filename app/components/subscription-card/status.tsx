import type { Subscription } from "@lemonsqueezy/lemonsqueezy.js";

import { Badge, type BadgeVariants } from "../ui/badge";

type SubscriptionStatusType = Subscription["data"]["attributes"]["status"];

export type SubscriptionStatusProps = {
  status: SubscriptionStatusType;
  statusFormatted: string;
  isPaused?: boolean;
};

export const SubscriptionStatus = ({
  status,
  statusFormatted,
  isPaused,
}: SubscriptionStatusProps) => {
  const statusColor: Record<SubscriptionStatusType, BadgeVariants> = {
    active: "default",
    cancelled: "outline",
    expired: "destructive",
    past_due: "destructive",
    on_trial: "default",
    unpaid: "destructive",
    pause: "secondary",
    paused: "secondary",
  };

  const _status = isPaused ? "paused" : status;
  const _statusFormatted = isPaused ? "Paused" : statusFormatted;

  return (
    <>
      {status !== "cancelled" && (
        <span className="text-surface-200">&bull;</span>
      )}

      <Badge variant={statusColor[_status]}>{_statusFormatted}</Badge>
    </>
  );
};
