import { eq } from "drizzle-orm";
import { type LibSQLDatabase } from "drizzle-orm/libsql";

import * as schema from "../../drizzle/tenant-schema";

export const PostsModel = (db: LibSQLDatabase<typeof schema>) => {
  return {
    delete: async (id: string) => {
      return await db.delete(schema.posts).where(eq(schema.posts.id, id));
    },
  };
};
