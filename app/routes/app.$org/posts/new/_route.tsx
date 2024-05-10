import { useState } from "react";
import {
  getFormProps,
  getInputProps,
  getTextareaProps,
  useForm,
} from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";
import { LoaderIcon } from "lucide-react";

import { appLink } from "~/utils/app-link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { TenantDBContext } from "~/middleware/require-tenant-db";
import { toSlug } from "~/utils";
import { NewPostSchema } from "./new-post.schema";
import { newPost } from "./new-post.server";

export const action = async ({ request, context }: ActionFunctionArgs) => {
  const { db, user, org } = context.get(TenantDBContext);
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: NewPostSchema,
    async: true,
  });

  // Send the submission back to the client if the status is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }

  const post = await newPost({ ...submission.value, authorId: user.id }, db);
  if (!post) {
    return submission.reply({
      formErrors: ["Failed to create post"],
    });
  }
  throw redirect(appLink("/posts/", org));
};

export default function NewPost() {
  const lastResult = useActionData<typeof action>();
  const [slugPreview, setSlugPreview] = useState<string | null>(null);

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(NewPostSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: NewPostSchema });
    },
  });

  const navigation = useNavigation();

  return (
    <div>
      <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        New Post
      </h2>
      <Form
        {...getFormProps(form)}
        className="flex w-[28rem] flex-col gap-3 rounded-md border border-input bg-card p-8"
        method="post"
      >
        <div>{form.errors}</div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.title.id}>Title</Label>
          <Input
            {...getInputProps(fields.title, { type: "text" })}
            onChange={(e) => {
              setSlugPreview(toSlug(e.currentTarget.value));
            }}
          />
          <p className="font-mono text-xs text-muted-foreground">
            url: /{slugPreview}
          </p>
          <div
            id={fields.title.errorId}
            className="max-w-md text-xs text-destructive "
          >
            {fields.title.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.content.id}>Content</Label>
          <Textarea {...getTextareaProps(fields.content)} />
          <div id={fields.content.errorId} className="text-xs text-destructive">
            {fields.content.errors}
          </div>
        </div>
        <div className="flex flex-row-reverse">
          <Button type="submit" disabled={navigation.state !== "idle"}>
            {navigation.state !== "idle" && (
              <LoaderIcon className="mr-1 h-4 w-4 animate-spin" />
            )}{" "}
            Create Post
          </Button>
        </div>
      </Form>
    </div>
  );
}
