import { redirect } from "@remix-run/node";
import type { Params } from "@remix-run/react";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { users, type User } from "drizzle/schema";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { authSessionStorage } from "~/utils/session.server";
import { UsersModel } from "~/models/users.server";
import { serviceDb } from "./db.server";

export const authenticator = new Authenticator<{ id: string }>(
  authSessionStorage,
);

export async function requireAnonymous(request: Request) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/space");
  }
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let email = form.get("email") as string;
    let password = form.get("password") as string;
    let user = await login({ email, password });
    if (!user) throw new Error("Invalid email or password");
    return user;
  }),
  // each strategy has a name and can be changed to use another one
  // same strategy multiple times, especially useful for the OAuth2 strategy.
  "user-pass",
);

export async function requireUserId(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const requestUrl = new URL(request.url);
  redirectTo =
    redirectTo === null
      ? null
      : redirectTo ?? `${requestUrl.pathname}${requestUrl.search}`;
  const loginParams = redirectTo
    ? new URLSearchParams([["redirectTo", redirectTo]])
    : null;
  const failureRedirect = ["/login", loginParams?.toString()]
    .filter(Boolean)
    .join("?");
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect,
  });
  return user.id;
}

export async function requireUser(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const userId = await requireUserId(request, { redirectTo });
  const user = await UsersModel.getById(userId);
  if (!user) {
    throw new Error("User not found");
  }
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

export async function requireUserOrg(
  request: Request,
  orgSlug: string | Params<string>,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  let slug = typeof orgSlug === "string" ? orgSlug : orgSlug.org;
  if (!slug) throw new Error("Organization slug is required");
  const user = await requireUser(request, { redirectTo });
  const org = await UsersModel.getUserOrg(user.id, slug);
  if (!org) {
    throw new Error("Organization not found");
  }
  return { user, org };
}

export async function getPasswordHash(password: string) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

export const sessionKey = "sessionId";

async function getUserId(request: Request) {
  const user = await authenticator.isAuthenticated(request);
  if (!user) return null;
  return user.id;
}

export async function getUser(request: Request) {
  const userId = await getUserId(request);
  if (!userId) return null;

  const user = await serviceDb().query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      id: true,
      name: true,
      email: true,
    },
    with: {
      organizations: {
        columns: {
          organizationId: true,
          role: true,
        },
      },
    },
  });
  if (user) return user;

  throw await authenticator.logout(request, { redirectTo: "/login" });
}

export async function login({
  email,
  password,
}: {
  email: User["email"];
  password: string;
}) {
  const user = await verifyUserPassword(email, password);
  if (!user) return null;
  return user;
}

export async function verifyUserPassword(email: string, password: string) {
  const db = serviceDb();
  const userWithPassword = await db.query.users.findFirst({
    where: eq(users.email, email),
    columns: {
      id: true,
      password: true,
    },
  });

  if (!userWithPassword || !userWithPassword.password) {
    return null;
  }
  const isValid = await bcrypt.compare(password, userWithPassword.password);
  if (!isValid) {
    return null;
  }

  return { id: userWithPassword.id };
}
