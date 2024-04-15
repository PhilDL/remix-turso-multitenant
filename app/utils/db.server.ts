import { createClient } from "@libsql/client/http";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env.server";
import * as schema from "../../drizzle/schema";

export function buildDbClient() {
  const url = env.TURSO_DB_URL.trim();
  if (url === undefined) {
    throw new Error("TURSO_DB_URL is not defined");
  }

  const authToken = env.TURSO_DB_AUTH_TOKEN.trim();
  if (authToken === undefined) {
    if (!url.includes("file:")) {
      throw new Error("TURSO_DB_AUTH_TOKEN is not defined");
    }
  }

  return drizzle(createClient({ url, authToken }), { schema });
}
