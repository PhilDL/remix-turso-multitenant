import { Form, NavLink, Outlet } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils";

export default function AppLayout() {
  return (
    <div className="flex h-full min-h-screen w-full flex-row">
      <aside className="border-r-input flex h-full min-h-screen w-56 flex-col justify-start gap-8 border-r p-4">
        <h1 className="text-2xl font-bold">Tantilument</h1>

        <nav className="flex flex-1 flex-col justify-start">
          <ul className="flex flex-col gap-2">
            <li>
              <NavLink
                className={({ isActive }) =>
                  cn(
                    "text-muted-foreground hover:text-underline",
                    isActive && "text-primary",
                  )
                }
                to="/app/dashboard"
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
                to="/app/posts"
              >
                Posts
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      <div className="flex h-full w-full flex-col">
        <nav className="border-b-input flex h-32 flex-1 flex-row justify-end border-b px-4 py-2">
          <Form method="post" action="/logout">
            <Button type="submit" variant={"secondary"} size="sm">
              Logout
            </Button>
          </Form>
        </nav>
        <main className="p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
