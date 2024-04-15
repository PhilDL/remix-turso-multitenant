import { createId } from "@paralleldrive/cuid2";
import { organizations } from "drizzle/schema";
import type { z } from "zod";

import { getPasswordHash } from "~/utils/auth.server";
import { buildDbClient } from "~/utils/db.server";
import { RegisterSchema } from "./register.schema";

export const ServerRegisterSchema = RegisterSchema.refine(async (data) => {
  if (await oganizationEmailExists(data.email)) {
    return {
      message: "This email already exists",
      path: ["email"],
    };
  }
  return true;
})
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
  return await buildDbClient().query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.email, email),
  });
};

export const organizationUsernameExists = async (username: string) => {
  return await buildDbClient().query.organizations.findFirst({
    where: (organizations, { eq }) => eq(organizations.username, username),
  });
};

// this input is branded "ServerRegisterData" to be sure that we went through
// all the validation steps
export const register = async ({
  email,
  username,
  name,
  website,
  password,
}: ServerRegisterData) => {
  const db = buildDbClient();
  const encryptedPassword = await getPasswordHash(password);
  const dbUrl = `shuken-multitenant-${username}`;

  const newOrganization = await db
    .insert(organizations)
    .values({
      id: createId(),
      email,
      username,
      password: encryptedPassword,
      dbUrl,
      website: website,
      name: name,
    })
    .returning()
    .get();

  return newOrganization;
};
