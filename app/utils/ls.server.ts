import { env } from "~/env.server";
import { RemixLemonSqueezy } from "./remix-lemonsqueezy";

export const { createCheckoutURL } = RemixLemonSqueezy(env);
