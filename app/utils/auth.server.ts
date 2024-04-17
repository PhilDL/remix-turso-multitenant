import { redirect } from "@remix-run/node";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { organizations } from "drizzle/schema";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { authSessionStorage } from "~/utils/session.server";
import { buildDbClient } from "./db.server";

export type User = typeof organizations.$inferSelect;

export const authenticator = new Authenticator<{ id: string }>(
  authSessionStorage,
);

export async function requireAnonymous(request: Request) {
  const userId = await getUserId(request);
  if (userId) {
    throw redirect("/app/dashboard");
  }
}

authenticator.use(
  new FormStrategy(async ({ form }) => {
    let username = form.get("username") as string;
    let password = form.get("password") as string;
    let user = await login({ username, password });
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
  const failureRedirect = ["/admin/login", loginParams?.toString()]
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
  const user = await buildDbClient().query.organizations.findFirst({
    where: eq(organizations.id, userId),
    columns: {
      id: true,
      username: true,
      dbUrl: true,
    },
  });
  if (!user) {
    throw new Error("User not found");
  }
  return user;
}

export async function requireUserDbURL(
  request: Request,
  { redirectTo }: { redirectTo?: string | null } = {},
) {
  const user = await requireUser(request, { redirectTo });
  if (!user.dbUrl) {
    throw new Error("This user doesn't have a database");
  }
  return user.dbUrl;
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

  const user = await buildDbClient().query.organizations.findFirst({
    where: eq(organizations.id, userId),
    columns: {
      id: true,
      username: true,
      dbUrl: true,
    },
  });
  if (user) return user;

  throw await authenticator.logout(request, { redirectTo: "/login" });
}

export async function login({
  username,
  password,
}: {
  username: User["username"];
  password: string;
}) {
  const user = await verifyUserPassword(username, password);
  if (!user) return null;
  return user;
}

export async function verifyUserPassword(username: string, password: string) {
  const db = buildDbClient();
  const userWithPassword = await db.query.organizations.findFirst({
    where: eq(organizations.username, username),
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
