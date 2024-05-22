import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { z } from "zod";

import { formatDate } from "~/utils/display";
import { toggleSubscriptionPause } from "~/utils/lemonsequeezy.server";
import { SubscriptionsModel } from "~/models/subscriptions.server";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";
import { UserAndOrgContext } from "~/middleware/require-user-and-org";

export const action = async ({
  context,
  params,
  request,
}: ActionFunctionArgs) => {
  const { org } = context.get(UserAndOrgContext);

  const subscription = org.planId
    ? await SubscriptionsModel.getByIdAndOrgId(params.id as string, org.id)
    : null;

  if (!subscription) {
    throw new Response("Subscription not found", { status: 404 });
  }
  const formData = await request.formData();

  const intent = z.enum(["pause", "unpause"]).parse(formData.get("intent"));
  const updatedSub = await toggleSubscriptionPause(
    intent,
    subscription.id,
    org.id,
  );
  console.log("Successfuly updated sub", updatedSub);
  throw new Response(null, {
    status: 303,
    headers: { Location: `/app/${org.slug}/billing` },
  });
};

export const loader = async ({ context, params }: LoaderFunctionArgs) => {
  const { org } = context.get(UserAndOrgContext);

  const subscription = org.planId
    ? await SubscriptionsModel.getByIdAndOrgId(params.id as string, org.id)
    : null;

  if (!subscription) {
    throw new Response("Subscription not found", { status: 404 });
  }
  return { subscription, org };
};

export default function PauseSubscription() {
  const navigate = useNavigate();
  const { subscription } = useLoaderData<typeof loader>();
  const isPaused = Boolean(subscription.isPaused);
  return (
    <AlertDialog
      defaultOpen={true}
      onOpenChange={(open) =>
        !open
          ? navigate("..", {
              replace: true,
              preventScrollReset: true,
            })
          : null
      }
    >
      <AlertDialogContent asChild>
        <Form
          method="POST"
          navigate={false}
          fetcherKey={`fetcher-update-sub-${subscription.id}`}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>Are you certain?</AlertDialogTitle>
            <AlertDialogDescription>
              {isPaused ? (
                <>
                  This action will resume your payments at the end of your
                  current billing period:
                  <span className="font-bold text-primary">
                    {formatDate(subscription.renewsAt)}
                  </span>
                </>
              ) : (
                <>
                  This action will pause your payments. You can still use it
                  until{" "}
                  <span className="font-bold text-primary">
                    {formatDate(subscription.renewsAt)}
                  </span>
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <input
            type="hidden"
            name="subscriptionId"
            value={subscription.id}
            readOnly
          />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>

            <AlertDialogAction
              type="submit"
              name="intent"
              value={isPaused ? "unpause" : "pause"}
            >
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
