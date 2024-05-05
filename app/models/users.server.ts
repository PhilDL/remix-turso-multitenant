import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import {
  organizations,
  User,
  UserCreate,
  users,
  usersToOrganizations,
  type SelectOrganizations,
} from "drizzle/schema";

import { serviceDb } from "~/utils/db.server";

export const UsersModel = {
  getById: async (orgId: string) => {
    return await serviceDb().query.users.findFirst({
      where: eq(organizations.id, orgId),
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        avatar: true,
      },
    });
  },
  emailExists: async (email: string) => {
    return (
      (
        await serviceDb().query.users.findFirst({
          where: (users, { eq }) => eq(users.email, email),
        })
      )?.id !== undefined
    );
  },

  create: async (data: Omit<UserCreate, "id">): Promise<User> => {
    return await serviceDb()
      .insert(users)
      .values({
        ...data,
        id: createId(),
      })
      .returning()
      .get();
  },
};
