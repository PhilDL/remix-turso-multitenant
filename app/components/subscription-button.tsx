import { useEffect } from "react";
import { useFetcher, useNavigate } from "@remix-run/react";
import type { NewPlan } from "drizzle/schema";

import type { action } from "~/routes/resources+/checkout";
import { Button } from "./ui/button";

export function SignupButton({
  plan,
  currentPlan,
  embed = true,
}: {
  plan: NewPlan;
  currentPlan?: NewPlan;
  embed?: boolean;
}) {
  const fetcher = useFetcher<typeof action>({ key: `checkout-${plan.id}` });
  const isCurrent = plan.id === currentPlan?.id;
  const navigate = useNavigate();

  const label = isCurrent ? "Your plan" : "Sign up";

  useEffect(() => {
    if (fetcher.data && fetcher.data.checkoutURL) {
      embed
        ? window.LemonSqueezy.Url.Open(fetcher.data.checkoutURL)
        : navigate(fetcher.data.checkoutURL);
    }
  }, [fetcher.data, embed, navigate]);

  // Make sure Lemon.js is loaded, you need to enqueue the Lemon Squeezy SDK in your app first.
  useEffect(() => {
    if (typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, []);

  return (
    <fetcher.Form method="POST" action="/resources/checkout">
      <input type="hidden" name="planId" value={plan.variantId} />
      <Button disabled={isCurrent || fetcher.state !== "idle"} type="submit">
        {label}
      </Button>
    </fetcher.Form>
  );
}
