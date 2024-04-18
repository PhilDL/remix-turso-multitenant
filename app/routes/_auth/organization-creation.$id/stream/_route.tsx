import type { LoaderFunctionArgs } from "@remix-run/node";

import { createEventStream } from "../create-event-stream.server";
import { organizationProgressEventName } from "../emitter.server";

export function loader({ request, params }: LoaderFunctionArgs) {
  return createEventStream(request, organizationProgressEventName(params.id!));
}
