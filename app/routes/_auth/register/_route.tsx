import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";

import { authenticator, requireAnonymous } from "~/utils/auth.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RegisterSchema } from "./register.schema";
import { register, ServerRegisterSchema } from "./register.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  return json({});
}

// Optional: Server action handler
export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await request.formData();
  const submission = await parseWithZod(formData, {
    schema: ServerRegisterSchema,
    async: true,
  });

  // Send the submission back to the client if the status is not successful
  if (submission.status !== "success") {
    return submission.reply();
  }

  await register(submission.value);

  return await authenticator.authenticate("user-pass", clonedRequest, {
    successRedirect: "/app",
    failureRedirect: "/login",
  });
}

// Client form component
export default function RegisterForm() {
  const lastResult = useActionData<typeof action>();

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
        Multenant
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
            Let's create the credentials you will use to connect to your space.
          </p>
        </div>

        <div>{form.errors}</div>
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
