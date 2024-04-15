import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    website: text("website").notNull(),
    username: text("username").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    logo: text("logo"),
    dbUrl: text("db_url"),
    createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
    updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
  },
  (organizations) => ({
    emailIdx: uniqueIndex("email_idx").on(organizations.email),
    usernameIdx: uniqueIndex("username_idx").on(organizations.username),
    nameIdx: index("name_idx").on(organizations.name),
  }),
);

export type SelectOrganizations = typeof organizations.$inferSelect;
