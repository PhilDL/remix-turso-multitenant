import { and, eq } from "drizzle-orm";
import {
  organizations,
  usersToOrganizations,
  type SelectOrganizations,
} from "drizzle/schema";

import { serviceDb } from "~/utils/db.server";

export const OrganizationsModel = {
  getById: async (orgId: string) => {
    return await serviceDb().query.organizations.findFirst({
      where: eq(organizations.id, orgId),
      columns: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        website: true,
        slug: true,
        logo: true,
        dbUrl: true,
      },
    });
  },

  slugExists: async (slug: string) => {
    return (
      (
        await serviceDb().query.organizations.findFirst({
          where: (organizations, { eq }) => eq(organizations.slug, slug),
        })
      )?.id !== undefined
    );
  },

  getByUserId: async (userId: string): Promise<SelectOrganizations[]> => {
    return await serviceDb()
      .select({
        id: organizations.id,
        name: organizations.name,
        email: organizations.email,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
        website: organizations.website,
        slug: organizations.slug,
        logo: organizations.logo,
        dbUrl: organizations.dbUrl,
      })
      .from(usersToOrganizations)
      .where(
        and(
          eq(usersToOrganizations.userId, userId),
          eq(usersToOrganizations.role, "owner"),
        ),
      )
      .innerJoin(
        organizations,
        eq(usersToOrganizations.organizationId, organizations.id),
      );
  },
};
