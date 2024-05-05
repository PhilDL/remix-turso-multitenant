import { getFormProps, getInputProps, useForm } from "@conform-to/react";
import { getZodConstraint, parseWithZod } from "@conform-to/zod";
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { z } from "zod";

import { authenticator, requireAnonymous } from "~/utils/auth.server";
import { commitSession, getSession } from "~/utils/session.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export const LoginFormSchema = z.object({
  username: z.string(),
  password: z.string(),
});

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAnonymous(request);
  let session = await getSession(request.headers.get("cookie"));
  let error = session.get(authenticator.sessionErrorKey);
  return json(
    { error },
    {
      headers: {
        "Set-Cookie": await commitSession(session), // You must commit the session whenever you read a flash
      },
    },
  );
}

export async function action({ request }: ActionFunctionArgs) {
  const clonedRequest = request.clone();
  const formData = await request.formData();
  const submission = parseWithZod(formData, { schema: LoginFormSchema });

  if (submission.status !== "success") {
    return json(submission.reply());
  }

  return await authenticator.authenticate("user-pass", clonedRequest, {
    successRedirect: "/app/dashboard",
    failureRedirect: "/login",
  });
}

// Client form component
export default function LoginForm() {
  const lastResult = useActionData<typeof action>();
  const { error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();

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
        Multenant
      </h1>
      <Form
        method="post"
        className="flex w-[28rem] flex-col gap-3 rounded-md border border-input bg-card p-8"
        {...getFormProps(form)}
      >
        <div className="flex flex-col gap-2">
          <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
            Log-in
          </h3>
          <p className="text-xs text-muted-foreground">
            Log-in to access your personal dashboard.
          </p>
        </div>

        <div className="text-sm text-destructive">{form.errors}</div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor={fields.username.id}>Username</Label>
          <Input {...getInputProps(fields.username, { type: "text" })} />
          <div
            id={fields.username.errorId}
            className="max-w-md text-xs text-destructive "
          >
            {fields.username.errors}
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
        {error && (
          <div className="text-sm text-destructive">{error.message}</div>
        )}
        <Button type="submit" disabled={navigation.state !== "idle"}>
          Login {navigation.state === "submitting" && "..."}
        </Button>
        <div className="mt-4 text-sm text-muted-foreground">
          Don't have an account yet?{" "}
          <Link
            to="/register"
            className="font-bold text-accent-foreground underline"
          >
            Register here
          </Link>
        </div>
      </Form>
    </div>
  );
}
