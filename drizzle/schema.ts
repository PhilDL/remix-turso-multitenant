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

export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  productId: text("productId").notNull(),
  productName: text("productName"),
  variantId: text("variantId").notNull().unique(),
  name: text("name").notNull(),
  description: text("description"),
  price: text("price").notNull(),
  isUsageBased: integer("isUsageBased", { mode: "boolean" }).default(false),
  interval: text("interval"),
  intervalCount: integer("intervalCount"),
  trialInterval: text("trialInterval"),
  trialIntervalCount: integer("trialIntervalCount"),
  sort: integer("sort"),
});

export type NewPlan = typeof plans.$inferInsert;
export type SelectPlans = typeof plans.$inferSelect;
