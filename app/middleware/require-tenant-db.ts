import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { createContext } from "remix-create-express-app/context";
import { type MiddlewareFunctionArgs } from "remix-create-express-app/middleware";

import { tenantDb } from "~/utils/db.tenant.server";
import type * as schema from "../../drizzle/tenant-schema";
import { UserAndOrgContext } from "./require-user-and-org";

export type TenantDBContext = {
  db: LibSQLDatabase<typeof schema>;
  user: UserAndOrgContext["user"];
  org: UserAndOrgContext["org"];
};

export const TenantDBContext = createContext<TenantDBContext>();

export async function requireTenantDBMiddleware({
  request,
  params,
  context,
  next,
}: MiddlewareFunctionArgs) {
  const { org, user } = context.get(UserAndOrgContext);
  if (!org.dbUrl) {
    throw new Error("org.dbUrl is not defined");
  }
  context.set(TenantDBContext, {
    db: tenantDb({ url: org.dbUrl! }),
    user,
    org,
  });
  return next();
}
