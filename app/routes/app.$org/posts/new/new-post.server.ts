import { createId } from "@paralleldrive/cuid2";
import type { LibSQLDatabase } from "drizzle-orm/libsql";
import { posts } from "drizzle/tenant-schema";
import slugify from "slugify";

import type * as schema from "../../../../../drizzle/tenant-schema";
import type { NewPost } from "./new-post.schema";

export const newPost = async (
  { title, content, authorId }: NewPost & { authorId: string },
  db: LibSQLDatabase<typeof schema>,
) => {
  const slug = slugify(title, { strict: true, lower: true, trim: true });

  const newPost = await db
    .insert(posts)
    .values({
      id: createId(),
      title,
      slug,
      content,
      authorId,
    })
    .returning()
    .get();

  return newPost;
};
