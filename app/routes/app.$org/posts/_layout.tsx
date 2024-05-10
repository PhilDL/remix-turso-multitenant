import { type LoaderFunctionArgs } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { serverOnly$ } from "vite-env-only";

import { requireTenantDBMiddleware } from "~/middleware/require-tenant-db";

export const middleware = serverOnly$([requireTenantDBMiddleware]);

export const loader = async ({ context }: LoaderFunctionArgs) => {
  return null;
};

export default function PostsLayout() {
  return <Outlet />;
}
