import { json, redirect, type ActionFunctionArgs } from "@remix-run/node";
import { z } from "zod";

import { createCheckoutURL } from "~/utils/ls.server";
import { UserAndOrgContext } from "~/middleware/require-user-and-org";

export async function action({ request, context }: ActionFunctionArgs) {
  const { user, org } = context.get(UserAndOrgContext);
  if (org.userRole !== "owner") {
    throw new Error("You must be an owner to checkout");
  }
  const formData = await request.formData();
  const planId = z.string().parse(formData.get("planId"));
  const embed = z
    .enum(["true", "false"])
    .optional()
    .default("true")
    .transform((value) => (value === "true" ? true : false))
    .parse(formData.get("embed"));
  const checkoutURL = await createCheckoutURL(planId, {
    orgId: org.id,
    email: user.email,
    embed,
  });
  if (embed) return json({ checkoutURL });
  return redirect(checkoutURL!);
}
