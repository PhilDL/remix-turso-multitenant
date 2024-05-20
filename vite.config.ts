import { vitePlugin as remix } from "@remix-run/dev";
import { installGlobals } from "@remix-run/node";
import { expressDevServer } from "remix-express-dev-server";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import envOnly from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

installGlobals({ nativeFetch: true });

export default defineConfig({
  build: { target: "esnext" },
  plugins: [
    expressDevServer(),
    envOnly(),
    remix({
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      future: { unstable_singleFetch: true },
    }),
    tsconfigPaths(),
  ],
  server: {
    port: 3000,
  },
});
