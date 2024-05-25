import { redirect } from "@remix-run/node";
import { createContext } from "remix-create-express-app/context";
import { type MiddlewareFunctionArgs } from "remix-create-express-app/middleware";

import { OrganizationsModel } from "~/models/organizations.server";
import { env } from "~/env.server";

export type OrgSubdomain = {
  id: string;
  name: string;
  dbUrl: string;
};

export const OrgContext = createContext<OrgSubdomain | null | undefined>();

export async function orgSubdomain({
  request,
  params,
  context,
  next,
}: MiddlewareFunctionArgs) {
  const url = new URL(request.url);
  console.log("test");
  if (url.hostname === env.PUBLIC_DOMAIN || url.hostname === "localhost") {
    context.set(OrgContext, null);
    return next();
  }
  const subdomain = url.hostname.split(".")[0];
  let orgContext: OrgSubdomain | null = null;
  if (subdomain && subdomain !== env.PUBLIC_DOMAIN.split(".")[0]) {
    const org = await OrganizationsModel.getBySlug(subdomain);
    if (org && org.dbUrl) {
      orgContext = {
        id: org.id,
        name: org.name,
        dbUrl: org.dbUrl,
      };
    } else {
      throw redirect(env.PUBLIC_APP_URL);
    }
  }
  context.set(OrgContext, orgContext);

  // getBySlug
  return next();
}
