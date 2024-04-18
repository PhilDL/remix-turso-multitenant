import { EventEmitter } from "events";
import { remember } from "@epic-web/remember";

import type { OperationStatus, OperationSteps } from "./operations-steps";

export const emitter = remember("emitter", () => new EventEmitter());

export const emitOrganizationCreationProgress = (
  creationId: string,
  state: Record<OperationSteps, OperationStatus>,
) => {
  emitter.emit(
    organizationProgressEventName(creationId),
    JSON.stringify(state),
  );
};

export const organizationProgressEventName = (creationId: string) =>
  `organization-creation-progress-${creationId}`;
