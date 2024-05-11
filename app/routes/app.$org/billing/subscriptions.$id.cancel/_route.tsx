import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";

import { formatDate } from "~/utils/display";
import { cancelSub } from "~/utils/lemonsequeezy.server";
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

export const action = async ({ context, params }: ActionFunctionArgs) => {
  const { org } = context.get(UserAndOrgContext);

  const subscription = org.planId
    ? await SubscriptionsModel.getByIdAndOrgId(params.id as string, org.id)
    : null;

  if (!subscription) {
    throw new Response("Subscription not found", { status: 404 });
  }
  const canceledSub = await cancelSub(subscription.id, org.id);
  if (canceledSub) {
    throw new Response(null, {
      status: 303,
      headers: { Location: `/app/${org.slug}/billing` },
    });
  }
  throw new Error("Failed to cancel subscription");
};

export default function CancelSubscription() {
  const navigate = useNavigate();
  const { subscription } = useLoaderData<typeof loader>();
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
        <Form method="POST">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you certain?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will cancel your subscription, but you can still use
              it until{" "}
              <span className="font-bold text-primary">
                {formatDate(subscription.renewsAt)}
              </span>
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

            <AlertDialogAction type="submit" name="intent" value="cancel">
              Confirm cancellation
            </AlertDialogAction>
          </AlertDialogFooter>
        </Form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
