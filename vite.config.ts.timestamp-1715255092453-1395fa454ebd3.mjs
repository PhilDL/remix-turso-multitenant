// vite.config.ts
import { vitePlugin as remix } from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/@remix-run/dev/dist/index.js";
import { installGlobals } from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/@remix-run/node/dist/index.js";
import { expressDevServer } from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/remix-express-dev-server/dist/index.js";
import { flatRoutes } from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/remix-flat-routes/dist/index.js";
import { defineConfig } from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/vite/dist/node/index.js";
import envOnly from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/vite-env-only/dist/index.js";
import tsconfigPaths from "file:///Users/philippelattention/Code/remix-turso-multitenant/node_modules/vite-tsconfig-paths/dist/index.mjs";
installGlobals({ nativeFetch: true });
var vite_config_default = defineConfig({
  build: { target: "esnext" },
  plugins: [
    expressDevServer(),
    envOnly(),
    remix({
      ignoredRouteFiles: ["**/*"],
      routes: async (defineRoutes) => {
        return flatRoutes("routes", defineRoutes);
      },
      future: { unstable_singleFetch: true }
    }),
    tsconfigPaths()
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcGhpbGlwcGVsYXR0ZW50aW9uL0NvZGUvcmVtaXgtdHVyc28tbXVsdGl0ZW5hbnRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIi9Vc2Vycy9waGlsaXBwZWxhdHRlbnRpb24vQ29kZS9yZW1peC10dXJzby1tdWx0aXRlbmFudC92aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vVXNlcnMvcGhpbGlwcGVsYXR0ZW50aW9uL0NvZGUvcmVtaXgtdHVyc28tbXVsdGl0ZW5hbnQvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyB2aXRlUGx1Z2luIGFzIHJlbWl4IH0gZnJvbSBcIkByZW1peC1ydW4vZGV2XCI7XG5pbXBvcnQgeyBpbnN0YWxsR2xvYmFscyB9IGZyb20gXCJAcmVtaXgtcnVuL25vZGVcIjtcbmltcG9ydCB7IGV4cHJlc3NEZXZTZXJ2ZXIgfSBmcm9tIFwicmVtaXgtZXhwcmVzcy1kZXYtc2VydmVyXCI7XG5pbXBvcnQgeyBmbGF0Um91dGVzIH0gZnJvbSBcInJlbWl4LWZsYXQtcm91dGVzXCI7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuaW1wb3J0IGVudk9ubHkgZnJvbSBcInZpdGUtZW52LW9ubHlcIjtcbmltcG9ydCB0c2NvbmZpZ1BhdGhzIGZyb20gXCJ2aXRlLXRzY29uZmlnLXBhdGhzXCI7XG5cbmluc3RhbGxHbG9iYWxzKHsgbmF0aXZlRmV0Y2g6IHRydWUgfSk7XG5cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XG4gIGJ1aWxkOiB7IHRhcmdldDogXCJlc25leHRcIiB9LFxuICBwbHVnaW5zOiBbXG4gICAgZXhwcmVzc0RldlNlcnZlcigpLFxuICAgIGVudk9ubHkoKSxcbiAgICByZW1peCh7XG4gICAgICBpZ25vcmVkUm91dGVGaWxlczogW1wiKiovKlwiXSxcbiAgICAgIHJvdXRlczogYXN5bmMgKGRlZmluZVJvdXRlcykgPT4ge1xuICAgICAgICByZXR1cm4gZmxhdFJvdXRlcyhcInJvdXRlc1wiLCBkZWZpbmVSb3V0ZXMpO1xuICAgICAgfSxcbiAgICAgIGZ1dHVyZTogeyB1bnN0YWJsZV9zaW5nbGVGZXRjaDogdHJ1ZSB9LFxuICAgIH0pLFxuICAgIHRzY29uZmlnUGF0aHMoKSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFvVixTQUFTLGNBQWMsYUFBYTtBQUN4WCxTQUFTLHNCQUFzQjtBQUMvQixTQUFTLHdCQUF3QjtBQUNqQyxTQUFTLGtCQUFrQjtBQUMzQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLGFBQWE7QUFDcEIsT0FBTyxtQkFBbUI7QUFFMUIsZUFBZSxFQUFFLGFBQWEsS0FBSyxDQUFDO0FBRXBDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLE9BQU8sRUFBRSxRQUFRLFNBQVM7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxpQkFBaUI7QUFBQSxJQUNqQixRQUFRO0FBQUEsSUFDUixNQUFNO0FBQUEsTUFDSixtQkFBbUIsQ0FBQyxNQUFNO0FBQUEsTUFDMUIsUUFBUSxPQUFPLGlCQUFpQjtBQUM5QixlQUFPLFdBQVcsVUFBVSxZQUFZO0FBQUEsTUFDMUM7QUFBQSxNQUNBLFFBQVEsRUFBRSxzQkFBc0IsS0FBSztBQUFBLElBQ3ZDLENBQUM7QUFBQSxJQUNELGNBQWM7QUFBQSxFQUNoQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
