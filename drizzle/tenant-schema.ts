import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const posts = sqliteTable(
  "posts",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    content: text("content"),
    html: text("html"),
    lexical: text("lexical"),
    featuredImage: text("featured_image"),
    excerpt: text("excerpt"),
    createdAt: integer("created_at", { mode: "timestamp" }).default(
      sql`(cast(unixepoch() as int))`,
    ),
    updatedAt: integer("updated_at", { mode: "timestamp" }).default(
      sql`(cast(unixepoch() as int))`,
    ),
    published: integer("published", { mode: "boolean" }).default(false),
    publishedAt: integer("published_at", { mode: "timestamp" }),
    authorId: text("author_id").notNull(),
    metaTitle: text("meta_title"),
    metaDescription: text("meta_description"),
    ogImage: text("og_image"),
  },
  (posts) => ({
    slug: uniqueIndex("slug_idx").on(posts.slug),
    authorId: index("author_id_idx").on(posts.authorId),
  }),
);
