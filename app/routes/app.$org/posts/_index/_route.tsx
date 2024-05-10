import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { tenantDb } from "~/utils/db.tenant.server";
import { AppLink } from "~/components/app-link";
import { buttonVariants } from "~/components/ui/button";
import { UserAndOrgContext } from "~/middleware/require-user-and-org";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { org } = context.get(UserAndOrgContext);
  const db = tenantDb({ url: org.dbUrl! });
  const posts = await db.query.posts.findMany({});
  return json({ posts });
};

export default function Dashboard() {
  const { posts } = useLoaderData<typeof loader>();
  return (
    <div className="max-w-xl">
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Posts
      </h2>
      <p className="text-muted-foreground">
        Here you will see all the posts you created
      </p>
      {posts.length === 0 ? (
        <div className="mt-8 flex w-full max-w-md flex-col items-center justify-center rounded-md border-2 border-dashed">
          <span className="mt-4 text-muted-foreground">No posts found</span>{" "}
        </div>
      ) : (
        <ul className="mt-8 flex flex-col gap-4 divide-y divide-input">
          {posts.map((post) => (
            <li key={post.id} className="flex flex-col gap-1">
              <AppLink
                to={`/posts/${post.slug}`}
                className="flex flex-row items-center gap-2 text-xl font-semibold hover:text-primary"
              >
                <span>{post.title}</span> <span>–</span>
                <span className="text-xs text-muted-foreground">
                  {new Date((post.createdAt ?? 0) * 1000).toLocaleDateString()}
                </span>
              </AppLink>
              {post.content ? (
                <div className="text-md text-muted-foreground">
                  {post.content?.length > 100
                    ? post.content.slice(0, 100) + "..."
                    : post.content}
                </div>
              ) : (
                <span className="text-muted-foreground">No content</span>
              )}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-8">
        <AppLink
          className={buttonVariants({ variant: "outline" })}
          to={"/posts/new"}
        >
          Write a post
        </AppLink>
      </div>
    </div>
  );
}
