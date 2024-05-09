import { vitePlugin as remix } from "@remix-run/dev";
import { remixDevTools } from "remix-development-tools/vite";
import { expressDevServer } from "remix-express-dev-server";
import { flatRoutes } from "remix-flat-routes";
import { defineConfig } from "vite";
import envOnly from "vite-env-only";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: { manifest: true },
  plugins: [
    remixDevTools(),
    tsconfigPaths(),
    expressDevServer(),
    envOnly(),
    remix({
      ignoredRouteFiles: ["**/*"],
      serverModuleFormat: "esm",
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes, {
          ignoredRouteFiles: ["**/*.test.{js,jsx,ts,tsx}", "**/__*.*"],
        });
      },
    }),
  ],
});
