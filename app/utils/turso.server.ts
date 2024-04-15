import { type SelectOrganizations } from "drizzle/schema";
import ky from "ky";

import { env } from "~/env.server";

type CreateDatabaseResponse = {
  database: {
    DbId: string;
    Hostname: string;
    Name: string;
  };
};

export async function createOrganizationDatabase(
  organization: SelectOrganizations,
) {
  const api = ky.create({
    prefixUrl: env.TURSO_API_URL,
    headers: {
      Authorization: `Bearer ${env.TURSO_API_TOKEN}`,
    },
  });

  // create a database for organization
  const orgDatabase = await api
    .post(`v1/databases`, {
      json: {
        name: `${env.APP_NAME}-${organization.username}`,
        group: `${env.TURSO_APP_GROUP}`,
        location: `${env.APP_PRIMARY_LOCATION}`,
        schema: `${env.TURSO_SCHEMA_DB_NAME}`,
      },
    })
    .json<CreateDatabaseResponse>();
  const {
    database: { Hostname: dbUrl },
  } = orgDatabase;

  // create an authentication token
  const orgToken = await api
    .post(
      `v1/organizations/${env.TURSO_APP_ORGANIZATION}/databases/${env.APP_NAME}-${organization.username}/auth/tokens`,
      {},
    )
    .json<{ jwt: string }>();
  const { jwt: authToken } = orgToken;

  return {
    ok: true,
    message: "Organization database created",
    data: {
      url: dbUrl,
      authToken,
    },
  };
}
