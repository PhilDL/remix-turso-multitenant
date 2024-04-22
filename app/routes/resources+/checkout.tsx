import { json, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

import { requireUser } from "~/utils/auth.server";
import { createCheckoutURL } from "~/utils/lemonsequeezy.server";

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const formData = await request.formData();
  const planId = z.string().parse(formData.get("planId"));
  const checkoutURL = await createCheckoutURL(planId, {
    userId: user.id,
    email: user.email,
  });
  return json({ checkoutURL });
}
