import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import { env } from "~/env.server";
import * as schema from "../../drizzle/schema";

export function serviceDb() {
  const url = env.TURSO_DB_URL.trim();
  const authToken = env.TURSO_DB_AUTH_TOKEN.trim();
  const local = env.TURSO_LOCAL_DB.trim();

  return drizzle(
    createClient({
      url: local,
      syncUrl: url,
      authToken,
      encryptionKey: env.SESSION_SECRET,
    }),
    {
      schema,
    },
  );
}
