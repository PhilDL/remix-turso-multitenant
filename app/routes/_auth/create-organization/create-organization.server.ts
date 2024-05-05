import { eq } from "drizzle-orm";
import { organizations } from "drizzle/schema";
import type { z } from "zod";

import { getPasswordHash } from "~/utils/auth.server";
import { serviceDb } from "~/utils/db.server";
import { createOrganizationDatabase } from "~/utils/turso.server";
import { emitOrganizationCreationProgress } from "../organization-creation.$id/emitter.server";
import type {
  OperationStatus,
  OperationSteps,
} from "../organization-creation.$id/operations-steps";
import { CreateOrganizationSchema } from "./create-organization.schema";

export const ServerRegisterSchema = CreateOrganizationSchema.refine(
  async (data) => {
    if (await oganizationEmailExists(data.email)) {
      return {
        message: "This email already exists",
        path: ["email"],
      };
    }
    return true;
  },
)
  .refine(async (data) => {
    if (await organizationUsernameExists(data.username)) {
      return {
        message: "This username already exists",
        path: ["username"],
      };
    }
    return true;
  })
  .brand("ValidServerRegisterSchema");

export type ServerRegisterData = z.infer<typeof ServerRegisterSchema>;

export const oganizationEmailExists = async (email: string) => {
  return await serviceDb().query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.email, email),
  });
};

export const organizationUsernameExists = async (username: string) => {
  return await serviceDb().query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.slug, username),
  });
};

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
export const register = async (
  { email, username, name, website, password }: ServerRegisterData,
  creationId: string,
) => {
  let state: Record<OperationSteps, OperationStatus> = {
    "organization-creation": "in-progress",
    "database-creation": "pending",
    "preparing-environment": "pending",
  };
  state = emitOperationsState(creationId, state, {
    "organization-creation": "in-progress",
  });
  const db = serviceDb();
  const encryptedPassword = await getPasswordHash(password);

  const newOrganization = await db
    .insert(organizations)
    .values({
      id: creationId,
      email,
      username,
      password: encryptedPassword,
      website: website,
      name: name,
    })
    .returning()
    .get();
  if (!newOrganization) {
    state = emitOperationsState(creationId, state, {
      "organization-creation": "error",
    });
    return;
  }
  state = emitOperationsState(creationId, state, {
    "organization-creation": "success",
    "database-creation": "in-progress",
  });

  const organizationDatabase =
    await createOrganizationDatabase(newOrganization);

  if (!organizationDatabase.ok) {
    await serviceDb()
      .delete(organizations)
      .where(eq(organizations.id, newOrganization.id));
    emitOperationsState(creationId, state, {
      "database-creation": "error",
    });
    return;
  }
  state = emitOperationsState(creationId, state, {
    "database-creation": "success",
    "preparing-environment": "in-progress",
  });
  if (organizationDatabase.ok && organizationDatabase.data !== null) {
    await serviceDb()
      .update(organizations)
      .set({
        dbUrl: organizationDatabase.data.url,
      })
      .where(eq(organizations.id, newOrganization.id));
    emitOperationsState(creationId, state, {
      "preparing-environment": "success",
    });
    return;
  }
  return;
};
