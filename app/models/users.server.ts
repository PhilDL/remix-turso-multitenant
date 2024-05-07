import { createId } from "@paralleldrive/cuid2";
import { and, eq } from "drizzle-orm";
import {
  organizations,
  subscriptions,
  users,
  usersToOrganizations,
  type User,
  type UserCreate,
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
  isMemberOfOrg: async (userId: string, organizationId: string) => {
    await serviceDb().query.usersToOrganizations.findFirst({
      where: and(
        eq(usersToOrganizations.userId, userId),
        eq(usersToOrganizations.organizationId, organizationId),
      ),
    });
  },
  getUserOrg: async (userId: string, organizationSlug: string) => {
    return await serviceDb()
      .select({
        id: organizations.id,
        name: organizations.name,
        slug: organizations.slug,
        dbUrl: organizations.dbUrl,
        subscriptionId: subscriptions.id,
        planId: subscriptions.planId,
        planStatus: subscriptions.status,
        userRole: usersToOrganizations.role,
      })
      .from(organizations)
      .where(eq(organizations.slug, organizationSlug))
      .innerJoin(
        usersToOrganizations,
        and(
          eq(organizations.id, usersToOrganizations.organizationId),
          eq(usersToOrganizations.userId, userId),
        ),
      )
      .leftJoin(
        subscriptions,
        eq(subscriptions.organizationId, organizations.id),
      )
      .get();
  },
};
