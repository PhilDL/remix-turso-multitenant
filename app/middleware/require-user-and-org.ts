import { createContext } from "remix-create-express-app/context";
import { type MiddlewareFunctionArgs } from "remix-create-express-app/middleware";

import { requireUserOrg } from "~/utils/auth.server";

export type UserAndOrgContext = {
  user: {
    id: string;
    name: string;
    email: string;
    avatar: string | null;
  };
  org: {
    id: string;
    name: string;
    slug: string;
    dbUrl: string | null;
    subscriptionId: string | null;
    planId: string | null;
    planStatus: string | null;
    userRole: "owner" | "member";
  };
};

export const UserAndOrgContext = createContext<UserAndOrgContext>();

export async function requireUserAndOrgMiddleware({
  request,
  params,
  context,
  next,
}: MiddlewareFunctionArgs) {
  const userAndOrg = await requireUserOrg(request, params.org as string);
  context.set(UserAndOrgContext, userAndOrg);
  return next();
}
