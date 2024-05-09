import { useEffect } from "react";
import { Form, useFetcher, useNavigate, useNavigation } from "@remix-run/react";
import type { NewPlan } from "drizzle/schema";

import type { action } from "~/routes/space.$org/billing.checkout/_route";
import { Button } from "./ui/button";

export function SignupButton({
  plan,
  orgSlug,
  currentPlan,
  embed = true,
}: {
  plan: NewPlan;
  orgSlug: string;
  currentPlan?: NewPlan;
  embed?: boolean;
}) {
  const fetcher = useFetcher<typeof action>({ key: `checkout-${plan.id}` });
  const isCurrent = plan.id === currentPlan?.id;
  const navigate = useNavigate();
  const navigation = useNavigation();

  const label = isCurrent ? "Your plan" : "Sign up";

  useEffect(() => {
    if (embed && fetcher.data && fetcher.data.checkoutURL) {
      window.LemonSqueezy.Url.Open(fetcher.data.checkoutURL);
    }
  }, [fetcher.data, embed, navigate]);

  // Make sure Lemon.js is loaded, you need to enqueue the Lemon Squeezy SDK in your app first.
  useEffect(() => {
    if (embed && typeof window.createLemonSqueezy === "function") {
      window.createLemonSqueezy();
    }
  }, [embed]);

  if (embed)
    return (
      <fetcher.Form method="POST" action={`/space/${orgSlug}/billing/checkout`}>
        <input type="hidden" name="planId" value={plan.variantId} />
        <input type="hidden" name="embed" value={String(embed)} />
        <Button disabled={isCurrent || fetcher.state !== "idle"} type="submit">
          {label}
        </Button>
      </fetcher.Form>
    );
  return (
    <Form method="POST" action={`/space/${orgSlug}/billing/checkout`}>
      <input type="hidden" name="planId" value={plan.variantId} />
      <input type="hidden" name="embed" value={String(embed)} />
      <Button disabled={isCurrent || navigation.state !== "idle"} type="submit">
        {label}
      </Button>
    </Form>
  );
}
