import type { z } from "zod";

import { getPasswordHash } from "~/utils/auth.server";
import { UsersModel } from "~/models/users.server";
import { emitOrganizationCreationProgress } from "../organization-creation.$id/emitter.server";
import type {
  OperationStatus,
  OperationSteps,
} from "../organization-creation.$id/operations-steps";
import { RegisterSchema } from "./register.schema";

export const ServerRegisterSchema = RegisterSchema.refine(async (data) => {
  if (await UsersModel.emailExists(data.email)) {
    return {
      message: "This email already exists",
      path: ["email"],
    };
  }
  return true;
}).brand("ValidServerRegisterSchema");

export type ServerRegisterData = z.infer<typeof ServerRegisterSchema>;

export const emitOperationsState = (
  creationId: string,
  state: Record<OperationSteps, OperationStatus>,
  update: Partial<Record<OperationSteps, OperationStatus>>,
) => {
  const newState = {
    ...state,
    ...update,
  };
  emitOrganizationCreationProgress(creationId, newState);
  return newState;
};

// this input is branded "ServerRegisterData" to be sure that we went through
// all the validation steps
export const register = async ({
  email,
  name,
  password,
}: ServerRegisterData) => {
  const encryptedPassword = await getPasswordHash(password);
  const user = await UsersModel.create({
    email,
    name,
    password: encryptedPassword,
  });
  return user;
};
