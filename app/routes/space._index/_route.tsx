import { redirect, type LoaderFunctionArgs } from "@remix-run/node";

import { requireUserId } from "~/utils/auth.server";
import { OrganizationsModel } from "~/models/organizations.server";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const organization = await OrganizationsModel.getByUserId(userId);
  if (organization.length === 0) {
    throw redirect("/create-organization");
  }
  throw redirect(`/space/${organization[0]!.slug}`);
};
