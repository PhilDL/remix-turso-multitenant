import type { Subscription } from "@lemonsqueezy/lemonsqueezy.js";

export type SubscriptionStatusType =
  Subscription["data"]["attributes"]["status"];

export const formatDate = (date: string | number | Date | null | undefined) => {
  if (!date) return "";

  return new Date(date).toLocaleString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};
export type SubscriptionDateProps = {
  endsAt?: string | null;
  renewsAt?: string | null;
  status: SubscriptionStatusType;
  trialEndsAt?: string | null;
};

export const SubscriptionDate = ({
  endsAt,
  renewsAt,
  trialEndsAt,
}: SubscriptionDateProps) => {
  const now = new Date();
  const trialEndDate = trialEndsAt ? new Date(trialEndsAt) : null;
  const endsAtDate = endsAt ? new Date(endsAt) : null;
  let message = `Renews on ${formatDate(renewsAt)}`;

  if (trialEndDate && trialEndDate > now) {
    message = `Ends on ${formatDate(trialEndsAt)}`;
  }

  if (endsAt) {
    message =
      endsAtDate && endsAtDate < now
        ? `Expired on ${formatDate(endsAt)}`
        : `Expires on ${formatDate(endsAt)}`;
  }

  return (
    <>
      {<span className="text-surface-200">&bull;</span>}
      <p>{message}</p>
    </>
  );
};
