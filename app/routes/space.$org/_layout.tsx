import type { LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";
import { BookIcon, CreditCardIcon, LayoutDashboardIcon } from "lucide-react";
import { serverOnly$ } from "vite-env-only";

import { initials } from "~/utils/display";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  requireUserAndOrgMiddleware,
  UserAndOrgContext,
} from "~/middleware/require-user-and-org";
import { cn } from "~/utils";

export const middleware = serverOnly$([requireUserAndOrgMiddleware]);

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const userAndOrg = context.get(UserAndOrgContext);
  return userAndOrg;
};

export default function AppLayout() {
  const { org, user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen w-full flex-row bg-stone-900">
      <aside className="flex h-full min-h-screen w-56 flex-col justify-start gap-8 p-4">
        <h1 className="text-2xl font-bold">Multenant</h1>

        <nav className="flex flex-1 flex-col justify-start">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "hover:text-underline flex items-center text-muted-foreground",
                    isActive && "text-primary",
                  )
                }
                to={`/space/${org.slug}/dashboard`}
                prefetch="intent"
              >
                <LayoutDashboardIcon className="mr-2 h-4 w-4" /> Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "hover:text-underline flex items-center text-muted-foreground",
                    "hover:text-underline hover:text-white",
                    isActive && "text-primary",
                  )
                }
                to={`/space/${org.slug}/posts`}
                prefetch="render"
              >
                <BookIcon className="mr-2 h-4 w-4" /> Posts
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "hover:text-underline flex items-center text-muted-foreground",
                    "hover:text-underline hover:text-white",
                    isActive && "text-primary",
                  )
                }
                to={`/space/${org.slug}/billing`}
                prefetch="render"
              >
                <CreditCardIcon className="mr-2 h-4 w-4" /> Billing
              </NavLink>
            </li>
          </ul>
        </nav>
        <div>{org.name}</div>
      </aside>
      <div className="flex h-full w-full flex-col">
        <nav className="flex h-32 flex-1 flex-row justify-end px-4 py-2">
          <div className="flex flex-row items-center gap-4 px-4">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={
                  user.avatar ??
                  "https://avatars.githubusercontent.com/u/4941205?v=4"
                }
              />
              <AvatarFallback>{initials(user.name)}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
          <Form method="post" action="/logout">
            <Button type="submit" variant={"secondary"} size="sm">
              Logout
            </Button>
          </Form>
        </nav>
        <main className="h-full min-h-screen rounded-md border bg-stone-950 p-4 lg:p-8">
          <Outlet context={{ orgSlug: org.slug }} />
        </main>
      </div>
    </div>
  );
}
