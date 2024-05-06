import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  primaryKey,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    password: text("password").notNull(),
    avatar: text("avatar"),
    createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
    updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
  },
  (users) => ({
    emailIdx: uniqueIndex("email_idx").on(users.email),
  }),
);

export type User = typeof users.$inferSelect;
export type UserCreate = typeof users.$inferInsert;

export const organizations = sqliteTable(
  "organizations",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    website: text("website"),
    slug: text("slug").notNull(),
    email: text("email"),
    logo: text("logo"),
    dbUrl: text("db_url"),
    createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
    updatedAt: integer("updated_at").default(sql`(cast(unixepoch() as int))`),
  },
  (organizations) => ({
    slugIdx: uniqueIndex("slug_idx").on(organizations.slug),
    nameIdx: index("name_idx").on(organizations.name),
  }),
);

export type SelectOrganizations = typeof organizations.$inferSelect;

export const usersToOrganizations = sqliteTable(
  "users_to_organizations",
  {
    userId: text("userId").references(() => users.id),
    organizationId: text("organizationId").references(() => organizations.id),
    role: text("role", { enum: ["owner", "member"] }).notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.organizationId] }),
    };
  },
);

export const usersRelations = relations(users, ({ many }) => ({
  organizations: many(usersToOrganizations),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  users: many(usersToOrganizations),
}));

export const usersToOrganizationsRelations = relations(
  usersToOrganizations,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [usersToOrganizations.organizationId],
      references: [organizations.id],
    }),
    user: one(users, {
      fields: [usersToOrganizations.userId],
      references: [users.id],
    }),
  }),
);

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

export const subscriptions = sqliteTable("subscription", {
  id: text("id").primaryKey(),
  lemonSqueezyId: text("lemonSqueezyId").unique().notNull(),
  orderId: integer("orderId").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  status: text("status").notNull(),
  statusFormatted: text("statusFormatted").notNull(),
  renewsAt: text("renewsAt"),
  endsAt: text("endsAt"),
  trialEndsAt: text("trialEndsAt"),
  price: text("price").notNull(),
  isUsageBased: integer("isUsageBased", { mode: "boolean" }).default(false),
  isPaused: integer("isPaused", { mode: "boolean" }).default(false),
  subscriptionItemId: text("subscriptionItemId"),
  organizationId: text("organizationId")
    .notNull()
    .references(() => organizations.id),
  planId: text("planId")
    .notNull()
    .references(() => plans.id),
});

export type SubscriptionCreate = typeof subscriptions.$inferInsert;
export type Subscription = typeof subscriptions.$inferSelect;

export const webhookEvents = sqliteTable("webhookEvent", {
  id: text("id").primaryKey(),
  createdAt: integer("created_at").default(sql`(cast(unixepoch() as int))`),
  eventName: text("eventName").notNull(),
  processed: integer("processed", { mode: "boolean" }).default(false),
  body: text("body", { mode: "json" }).notNull(),
  processingError: text("processingError"),
});

export type WebhookEventCreate = typeof webhookEvents.$inferInsert;
export type WebhookEvent = typeof webhookEvents.$inferSelect;
