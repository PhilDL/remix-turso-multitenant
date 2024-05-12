import { defer, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { UserAndOrgContext } from "~/middleware/require-user-and-org";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { user, org } = context.get(UserAndOrgContext);
  return defer({
    user,
    org,
  });
};

export default function Dashboard() {
  const { user, org } = useLoaderData<typeof loader>();
  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Dashboard
      </h2>
      <p className="text-sm text-muted-foreground">
        Hi {user.name}, here you can have an overview of your data in
        organization "{org.name}".
      </p>
    </div>
  );
}
