import { describe, expect, it } from "vitest";

import { initials } from "./display";

describe("initials", () => {
  it("should return the initials of a name", () => {
    expect(initials("John Doe")).toBe("JD");
    expect(initials("John")).toBe("J");
    expect(initials("John Jacob Jingleheimer Schmidt")).toBe("JS");
  });
});
