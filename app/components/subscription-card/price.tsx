import { formatPrice } from "~/utils";

export type SubscriptionPriceProps = {
  price: string;
  interval?: string | null;
  intervalCount?: number | null;
  isUsageBased?: boolean;
};

export const SubscriptionPrice = ({
  price,
  interval,
  intervalCount,
  isUsageBased,
}: SubscriptionPriceProps) => {
  let formattedPrice = formatPrice(price);
  if (isUsageBased) {
    formattedPrice += "/unit";
  }

  const formattedIntervalCount =
    intervalCount && intervalCount !== 1 ? `every ${intervalCount} ` : "every";

  return <p>{`${formattedPrice} ${formattedIntervalCount} ${interval}`}</p>;
};
