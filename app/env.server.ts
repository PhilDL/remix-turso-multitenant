import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SESSION_SECRET: z.string().min(1),
    TURSO_DB_AUTH_TOKEN: z.string().min(1),
    TURSO_LOCAL_DB: z.string().min(1),
    TURSO_DB_URL: z.string().url(),
    TURSO_API_TOKEN: z.string().min(1),
    TURSO_API_URL: z.string().url(),
    TURSO_SCHEMA_DB_NAME: z.string().min(1),
    TURSO_SCHEMA_DB_URL: z.string().url(),
    TURSO_APP_ORGANIZATION: z.string().min(1),
    TURSO_APP_GROUP: z.string().min(1),
    APP_NAME: z.string().min(1),
    APP_PRIMARY_LOCATION: z.string().min(1),
    LEMONSQUEEZY_API_KEY: z.string().min(1),
    LEMONSQUEEZY_STORE_ID: z.string().min(1),
    LEMONSQUEEZY_WEBHOOK_SECRET: z.string().max(40),
    PUBLIC_APP_URL: z.string().url(),
    PUBLIC_DOMAIN: z.string().min(1),
  },
  runtimeEnv: process.env,
});
