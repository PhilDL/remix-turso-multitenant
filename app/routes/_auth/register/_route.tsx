import { useState } from "react";
import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import { createId } from "@paralleldrive/cuid2";
import { redirect, type ActionFunctionArgs } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RegisterSchema, toSlug } from "./register.schema";
import { register, ServerRegisterSchema } from "./register.server";

// Optional: Server action handler
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: ServerRegisterSchema,
    async: true,
  });

  // Send the submission back to the client if the status is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }
  const creationId = createId();
  void register(submission.value, creationId);
  throw redirect(`/organization-creation/${creationId}`);
}

// Client form component
export default function RegisterForm() {
  const lastResult = useActionData<typeof action>();
  const [slugPreview, setSlugPreview] = useState<string | null>(null);

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(RegisterSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: RegisterSchema });
    },
  });

  return (
    <div className="flex min-w-96 flex-col gap-8">
      <h1 className="max-w-md scroll-m-20 text-center text-4xl font-extrabold tracking-tight">
        Tantilument
      </h1>
      <Form
        method="post"
        className="flex w-[28rem] flex-col gap-3 rounded-md border border-input bg-card p-8"
        {...getFormProps(form)}
      >
        <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Register
          </h3>
          <p className="text-xs text-muted-foreground">
            Create your own space on the web with Tantilument.
          </p>
        </div>

        <div>{form.errors}</div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.username.id}>Username</Label>
          <Input
            {...getInputProps(fields.username, { type: "text" })}
            onChange={(e) => {
              setSlugPreview(toSlug(e.currentTarget.value));
            }}
          />
          <p className="font-mono text-xs text-muted-foreground">
            {slugPreview}
          </p>
          <div
            id={fields.username.errorId}
            className="max-w-md text-xs text-destructive "
          >
            {fields.username.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.name.id}>Name</Label>
          <Input {...getInputProps(fields.name, { type: "text" })} />
          <div id={fields.name.errorId} className="text-xs text-destructive">
            {fields.name.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.email.id}>Email</Label>
          <Input {...getInputProps(fields.email, { type: "email" })} />
          <div id={fields.email.errorId} className="text-xs text-destructive">
            {fields.email.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.password.id}>Password</Label>
          <Input {...getInputProps(fields.password, { type: "password" })} />
          <div
            id={fields.password.errorId}
            className="text-xs text-destructive"
          >
            {fields.password.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.passwordConfirm.id}>Password confirm</Label>
          <Input
            {...getInputProps(fields.passwordConfirm, { type: "password" })}
          />
          <div
            id={fields.passwordConfirm.errorId}
            className="text-xs text-destructive"
          >
            {fields.passwordConfirm.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.website.id}>Website</Label>
          <Input {...getInputProps(fields.website, { type: "text" })} />
          <div id={fields.website.errorId} className="text-xs text-destructive">
            {fields.website.errors}
          </div>
        </div>

        <Button type="submit">Register</Button>
        <div className="mt-4 text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-accent-foreground underline"
          >
            Login here
          </Link>
        </div>
      </Form>
    </div>
  );
}
