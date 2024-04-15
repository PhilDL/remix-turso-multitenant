import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { z } from "zod";

import { authenticator, requireAnonymous } from "~/utils/auth.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return json({});
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: LoginFormSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  return await authenticator.authenticate("user-pass", clonedRequest, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
}

// Client form component
export default function LoginForm() {
  const lastResult = useActionData<typeof action>();

  const [form, fields] = useForm({
    lastResult,
    constraint: getZodConstraint(LoginFormSchema),
    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: LoginFormSchema });
    },
  });

  return (
    <div className="flex min-w-96 flex-col gap-8">
      <h1 className="max-w-md scroll-m-20 text-center text-4xl font-extrabold tracking-tight">
        Tantilument
      </h1>
      <Form
        method="post"
        className="border-input bg-card flex w-[28rem] flex-col gap-3 rounded-md border p-8"
        {...getFormProps(form)}
      >
        <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Log-in
          </h3>
          <p className="text-muted-foreground text-xs">
            Log-in to access your personal dashboard.
          </p>
        </div>

        <div>{form.errors}</div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.username.id}>Username</Label>
          <Input {...getInputProps(fields.username, { type: "text" })} />
          <div
            id={fields.username.errorId}
            className="text-destructive max-w-md text-xs "
          >
            {fields.username.errors}
          </div>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.password.id}>Password</Label>
          <Input {...getInputProps(fields.password, { type: "password" })} />
          <div
            id={fields.password.errorId}
            className="text-destructive text-xs"
          >
            {fields.password.errors}
          </div>
        </div>
        <Button type="submit">Login</Button>
      </Form>
    </div>
  );
}
