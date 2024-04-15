import { sql } from 'drizzle-orm'
import {
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const posts = sqliteTable(
  'posts',
  {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    slug: text('slug').notNull(),
    content: text('content'),
    createdAt: integer('created_at').default(sql`(cast(unixepoch() as int))`),
    updatedAt: integer('updated_at').default(sql`(cast(unixepoch() as int))`),
  },
  posts => ({
    slug: uniqueIndex('slug_idx').on(posts.slug),
  }),
)
