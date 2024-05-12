import {
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { MoreVertical, TrashIcon } from "lucide-react";
import { z } from "zod";

import { PostsModel } from "~/models/posts.server";
import { AppLink } from "~/components/app-link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button, buttonVariants } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { TenantDBContext } from "~/middleware/require-tenant-db";

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { db } = context.get(TenantDBContext);
  const posts = await db.query.posts.findMany({});
  return { posts };
};

export const action = async ({ context, request }: ActionFunctionArgs) => {
  const { db } = context.get(TenantDBContext);
  const formData = await request.formData();
  const intent = z.enum(["delete"]).parse(formData.get("intent"));
  switch (intent) {
    case "delete": {
      const postId = z.string().parse(formData.get("postId"));
      await PostsModel(db).delete(postId);
      break;
    }
  }
  return null;
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
        <ul className="mt-8 flex flex-col gap-4 divide-y divide-input rounded-md border border-input">
          {posts.map((post) => (
            <PostPreview key={post.id} post={post} />
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

export type PostPreviewProps = {
  post: {
    id: string;
    title: string;
    slug: string;
    content: string | null;
    html: string | null;
    lexical: string | null;
    featuredImage: string | null;
    excerpt: string | null;
    createdAt: Date | null;
    ogImage: string | null;
  };
};

export const PostPreview = ({ post }: PostPreviewProps) => {
  const deleteFetcher = useFetcher<typeof action>({
    key: `delete-post-fetcher-${post.id}`,
  });
  // optimistic delete
  if (deleteFetcher.formData?.get("postId") === post.id) {
    return null;
  }
  return (
    <li className="flex flex-row items-center gap-1 p-4">
      <div className="flex flex-1 flex-col">
        <AppLink
          to={`/posts/${post.slug}`}
          className="flex flex-row items-center gap-2 text-xl font-semibold hover:text-primary"
        >
          <span>{post.title}</span> <span>–</span>
          <span className="text-xs text-muted-foreground">
            {post.createdAt?.toLocaleDateString()}
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
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <AlertDialog>
            <AlertDialogTrigger className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-muted focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
              <TrashIcon className="mr-2 h-4 w-4" /> Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you certain?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone, it will delete that post
                  permanently.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>

                <AlertDialogAction
                  type="submit"
                  onClick={() =>
                    deleteFetcher.submit(
                      {
                        intent: "delete",
                        postId: post.id,
                      },
                      { method: "post" },
                    )
                  }
                >
                  Confirm deletion
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DropdownMenuContent>
      </DropdownMenu>
    </li>
  );
};
