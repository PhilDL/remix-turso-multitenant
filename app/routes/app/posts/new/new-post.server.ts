import { createId } from "@paralleldrive/cuid2";
import { posts } from "drizzle/tenant-schema";
import slugify from "slugify";

import { buildDbClient } from "~/utils/db.tenant.server";
import type { NewPost } from "./new-post.schema";

export const newPost = async ({ title, content }: NewPost, dbUrl: string) => {
  const slug = slugify(title, { strict: true, lower: true, trim: true });

  const db = buildDbClient({ url: dbUrl });

  const newPost = await db
    .insert(posts)
    .values({
      id: createId(),
      title,
      slug,
      content,
    })
    .returning()
    .get();

  return newPost;
};
