import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env.server";
import * as schema from "../../drizzle/tenant-schema";

interface BuildTenantDBParams {
  url: string;
  TURSO_DB_AUTH_TOKEN?: string;
}

export function buildDbClient({ url }: BuildTenantDBParams) {
  if (url === undefined) {
    throw new Error("db url is not defined");
  }

  const authToken = env.TURSO_DB_AUTH_TOKEN.trim();
  if (authToken === undefined) {
    throw new Error("TURSO_DB_AUTH_TOKEN is not defined");
  }

  return drizzle(createClient({ url: `libsql://${url}`, authToken }), {
    schema,
  });
}
