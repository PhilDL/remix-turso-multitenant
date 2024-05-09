import "@testing-library/jest-dom/vitest";

import { installGlobals } from "@remix-run/node";
import { afterAll, afterEach } from "vitest";

installGlobals({ nativeFetch: true });

// one time setup here
// fs.copyFileSync(BASE_DATABASE_PATH, DATABASE_PATH)

afterEach(() => {});
afterAll(async () => {});
