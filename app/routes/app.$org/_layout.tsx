import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Form, NavLink, Outlet, useLoaderData } from "@remix-run/react";

import { requireUserOrg } from "~/utils/auth.server";
import { initials } from "~/utils/display";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const userAndOrg = await requireUserOrg(request, params.org as string);
  return json(userAndOrg);
};

export default function AppLayout() {
  const { org, user } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-full min-h-screen w-full flex-row">
      <aside className="flex h-full min-h-screen w-56 flex-col justify-start gap-8 border-r border-r-input p-4">
        <h1 className="text-2xl font-bold">Multenant</h1>

        <nav className="flex flex-1 flex-col justify-start">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "hover:text-underline text-muted-foreground",
                    isActive && "text-primary",
                  )
                }
                to={`/app/${org.slug}/dashboard`}
              >
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground",
                    "hover:text-underline hover:text-white",
                    isActive && "text-primary",
                  )
                }
                to={`/app/${org.slug}/posts`}
              >
                Posts
              </NavLink>
            </li>
          </ul>
        </nav>
        <div>{org.name}</div>
      </aside>
      <div className="flex h-full w-full flex-col">
        <nav className="flex h-32 flex-1 flex-row justify-end border-b border-b-input px-4 py-2">
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
        <main className="p-4">
          <Outlet context={{ orgSlug: org.slug }} />
        </main>
      </div>
    </div>
  );
}
