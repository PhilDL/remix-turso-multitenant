import "dotenv/config";

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";

import { env } from "~/env.server";

export const client = createClient({
  url: env.TURSO_SCHEMA_DB_URL,
  authToken: env.TURSO_DB_AUTH_TOKEN,
});

async function main() {
  const copiedTenantSchema = `CREATE TABLE "posts" (
    "id" text PRIMARY KEY NOT NULL,
    "title" text NOT NULL,
    "slug" text NOT NULL,
    "content" text,
    "html" text,
    "lexical" text,
    "featured_image" text,
    "excerpt" text,
    "created_at" integer DEFAULT (cast(unixepoch() as int)),
    "updated_at" integer DEFAULT (cast(unixepoch() as int)),
    "published" integer DEFAULT false,
    "published_at" integer,
    "author_id" text NOT NULL,
    "meta_title" text,
    "meta_description" text,
    "og_image" text
  );
  --> statement-breakpoint
  CREATE UNIQUE INDEX "slug_idx" ON "posts" ("slug");--> statement-breakpoint
  CREATE INDEX "author_id_idx" ON "posts" ("author_id");
  `;
  try {
    const statements = copiedTenantSchema.split("--> statement-breakpoint");

    await client.batch(statements);
    console.log("Tenant Tables migrated on schema DB!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

// export const db = drizzle(client);

// async function main() {
//   try {
//     await migrate(db, {
//       migrationsFolder: "drizzle/migrations-tenants",
//     });
//     console.log("Tenant Tables migrated on schema DB!");
//     process.exit(0);
//   } catch (error) {
//     console.error("Error performing migration: ", error);
//     process.exit(1);
//   }
// }

main();
