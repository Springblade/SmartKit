import { describe, it, expect } from "vitest";
import { isEnabled } from "../lib/feature-flag";

describe("isEnabled", () => {
  it("returns default when no env set", () => {
    expect(isEnabled("dark_mode", false)).toBe(false);
    expect(isEnabled("v2", true)).toBe(true);
  });

  it("reads env override", () => {
    process.env.FLAG_V2 = "true";
    expect(isEnabled("v2", false)).toBe(true);
    delete process.env.FLAG_V2;
  });

  it("cache hit within 5 min", () => {
    process.env.FLAG_X = "true";
    const a = isEnabled("x", false);
    process.env.FLAG_X = "false";
    const b = isEnabled("x", false);
    expect(a).toBe(b);
  });
});
