import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

import { authenticator } from "~/utils/auth.server";

export const handle = {
  getSitemapEntries: () => null,
};

export async function loader({ request }: LoaderFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}

export async function action({ request }: ActionFunctionArgs) {
  await authenticator.logout(request, { redirectTo: "/login" });
}
