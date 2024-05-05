import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  BoltIcon,
  BriefcaseIcon,
  BuildingIcon,
  CogIcon,
  LayersIcon,
  LockIcon,
  MountainIcon,
  RocketIcon,
  UsersIcon,
} from "lucide-react";

import { buttonVariants } from "~/components/ui/button";

export const meta: MetaFunction = () => {
  return [
    { title: "Remix+Vite" },
    { name: "description", content: "Welcome to Remix+Vite!" },
  ];
};

export default function Index() {
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
