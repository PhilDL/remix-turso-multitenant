import { createContext } from "remix-create-express-app/context";
import { type MiddlewareFunctionArgs } from "remix-create-express-app/middleware";

import { requireUser } from "~/utils/auth.server";

export type UserContext = {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
};

export const UserContext = createContext<UserContext>();

export async function requireUserMiddleware({
  request,
  params,
  context,
  next,
}: MiddlewareFunctionArgs) {
  const user = await requireUser(request);
  context.set(UserContext, user);
  return next();
}
