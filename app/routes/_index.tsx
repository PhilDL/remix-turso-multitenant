import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import {
  BoltIcon,
  BriefcaseIcon,
  BuildingIcon,
  CogIcon,
  LayersIcon,
  LockIcon,
  MountainIcon,
  RocketIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import { serverOnly$ } from "vite-env-only";

import { tenantDb } from "~/utils/db.tenant.server";
import { buttonVariants } from "~/components/ui/button";
import {
  OrgContext,
  orgSubdomain,
  type OrgSubdomain,
} from "~/middleware/org-subdomain";

export const middleware = serverOnly$([orgSubdomain]);

export const meta: MetaFunction = () => {
  return [
    { title: "Multenant" },
    { name: "description", content: "The Remix Turso SaaS starter" },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const org = context.get(OrgContext) as OrgSubdomain | null;
  if (!org) {
    return null;
  }
  const db = tenantDb({ url: org.dbUrl });
  const posts = await db.query.posts.findMany({});
  return { org, posts };
};

export default function Index() {
  const tenantData = useLoaderData<typeof loader>();
  if (tenantData) {
    return (
      <div className="container mx-auto flex flex-col-reverse items-start justify-between gap-8 py-12 md:flex-row md:gap-12 md:py-16 lg:gap-16 lg:py-20">
        <div className="flex flex-col gap-8 overflow-x-auto md:w-2/3 md:gap-12 lg:w-3/4 lg:gap-16">
          {tenantData.posts.map((post, index) => (
            <div key={post.id} className="flex w-full flex-row rounded-lg">
              <img
                alt={post.title}
                className="h-48 rounded-md object-cover"
                height={200}
                src={`https://picsum.photos/200/300?random=${index + 1}`}
                width={300}
              />
              <div className="flex-1 flex-col justify-start px-6">
                <h3 className="mb-2 text-xl font-bold">{post.title}</h3>
                <p className="mb-4 line-clamp-3 text-gray-600">
                  {post.content}
                </p>
                <div className="flex items-center text-sm text-gray-500">
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>John Doe</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mb-8 md:mb-0 md:w-1/3 lg:w-1/4">
          <div className="overflow-hidden rounded-lg">
            <div className="p-6">
              <Link className="text-lg font-bold text-primary" to="#">
                {tenantData.org.name}
              </Link>
              <p className="mt-2 text-muted-foreground">
                Welcome to the Acme Blog, where we share insights and
                inspiration on a variety of topics.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" to="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Multitenant Starter Kit</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#"
          >
            Docs
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            to="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    A Multitenant Starter Kit for Your Next Web App
                  </h1>
                  <p className="max-w-[600px] text-gray-500 dark:text-gray-400 md:text-xl">
                    Quickly build and deploy a multitenant web application with
                    pre-built features and integrations. Ideal for SaaS, B2B,
                    and enterprise applications.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link
                    className={buttonVariants({ variant: "default" })}
                    to={"/register"}
                  >
                    Get Started
                  </Link>
                  <Link
                    className={buttonVariants({ variant: "outline" })}
                    to="/login"
                  >
                    I already have an account
                  </Link>
                </div>
              </div>
              <img
                alt="Hero"
                className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                height="550"
                src="/placeholder.svg"
                width="550"
              />
            </div>
          </div>
        </section>
        <section className="w-full bg-card md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Key Features
                </h2>
                <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The Multitenant Starter Kit comes with a comprehensive set of
                  features to help you build and deploy your web application
                  quickly.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <LayersIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Multitenancy</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Easily manage multiple tenants and their data within a
                    single application.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <BoltIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Scalability</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Automatically scale your application to handle increased
                    traffic and user loads.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <LockIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Security</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Robust security features to protect your data and ensure
                    compliance.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <BriefcaseIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Integrations</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Seamlessly integrate with popular third-party services and
                    tools.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <CogIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Customization</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Easily customize the look and feel to match your brand
                    identity.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <RocketIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Rapid Development</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Get your application up and running quickly with pre-built
                    features.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="w-full bg-muted py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Who Can Use the Starter Kit?
                </h2>
                <p className="max-w-[900px] text-gray-500 dark:text-gray-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  The Multitenant Starter Kit is designed to be flexible and
                  adaptable to a wide range of use cases.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <BuildingIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">Enterprises</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Manage multiple business units and subsidiaries with
                    centralized control.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <BriefcaseIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">SaaS Providers</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Offer a multi-tenant platform to your customers with
                    customizable branding and access controls.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-center space-y-4">
                <div className="grid gap-1">
                  <UsersIcon className="h-8 w-8 text-gray-900 dark:text-gray-50" />
                  <h3 className="text-xl font-bold">B2B Companies</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Provide a secure and scalable platform for your business
                    customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Multitenant Starter Kit. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Pricing
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Docs
          </Link>
          <Link className="text-xs underline-offset-4 hover:underline" to="#">
            Contact
          </Link>
        </nav>
      </footer>
    </div>
  );
}
