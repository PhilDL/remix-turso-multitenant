import { useEffect, useState } from "react";
import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useResolvedPath } from "@remix-run/react";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  LoaderIcon,
} from "lucide-react";
import { useEventSource } from "remix-utils/sse/react";
import { z } from "zod";

import { appLink } from "~/utils/app-link";
import { OrganizationsModel } from "~/models/organizations.server";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/utils";
import { type OperationStatus, type OperationSteps } from "../operations-steps";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  let initialState: Record<OperationSteps, OperationStatus> = {
    "organization-creation": "in-progress",
    "database-creation": "pending",
    "preparing-environment": "pending",
  };
  const parsedId = z.string().safeParse(params.id);
  if (parsedId.success === false) {
    throw new Error("Invalid organization id");
  }
  const org = await OrganizationsModel.getById(parsedId.data);
  if (org) {
    initialState = {
      "organization-creation": "success",
      "database-creation": org.dbUrl ? "success" : "in-progress",
      "preparing-environment": org.dbUrl ? "success" : "pending",
    };
  }
  return json({ initialState, org });
};

export default function OrganizationCreation() {
  const path = useResolvedPath("./stream");
  const data = useEventSource(path.pathname);
  const { initialState, org } = useLoaderData<typeof loader>();
  const [operationEvents, setOperationEvents] =
    useState<Record<OperationSteps, OperationStatus>>(initialState);

  useEffect(() => {
    if (data) {
      setOperationEvents(JSON.parse(data));
    }
  }, [data]);

  return (
    <div className="flex min-w-96 flex-col gap-8">
      <h1 className="max-w-md scroll-m-20 text-center text-4xl font-extrabold tracking-tight">
        Multenant
      </h1>

      <div className="flex w-[28rem] flex-col gap-3 rounded-md border border-input bg-card p-8">
        <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Creating your organization
          </h3>
          <p className="text-xs text-muted-foreground">
            We are creating your own space on the web, please wait a moment.
          </p>
        </div>
        <ul className="mt-4 flex flex-col gap-1 text-sm">
          <OperationLiveStatus
            status={operationEvents["organization-creation"]}
            description="Organization creation"
          />
          <OperationLiveStatus
            status={operationEvents["database-creation"]}
            description="Database creation"
          />
          <OperationLiveStatus
            status={operationEvents["preparing-environment"]}
            description="Preparing environment"
          />
        </ul>
      </div>
      {Object.values(operationEvents).every((status) => status === "success") &&
        org?.slug && (
          <div className="flex flex-col">
            <p className="mb-4 text-accent-foreground">
              Your organization has been created successfully!
            </p>
            <Link
              to={appLink("/", org)}
              className={buttonVariants({ variant: "default" })}
            >
              Go to your organization
            </Link>
          </div>
        )}
    </div>
  );
}

export const OperationLiveStatus = ({
  description,
  status,
}: {
  description: string;
  status: OperationStatus;
}) => {
  let Icon;
  switch (status) {
    case "in-progress":
      Icon = <LoaderIcon className="mr-2 h-4 w-4 animate-spin" />;
      break;
    case "pending":
      Icon = (
        <CircleDashedIcon className="mr-2 h-4 w-4 text-muted-foreground" />
      );
      break;
    case "success":
      Icon = <CircleCheckIcon className="mr-2 h-4 w-4 text-lime-500" />;
      break;
    case "error":
      Icon = <CircleXIcon className="mr-2 h-4 w-4 text-destructive" />;
      break;
  }

  return (
    <li
      className={cn(
        "flex flex-row items-center text-muted-foreground",
        status === "success" && "text-accent-foreground",
      )}
    >
      {Icon} <span>{description}</span>
    </li>
  );
};
