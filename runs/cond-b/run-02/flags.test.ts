import { describe, it, expect, beforeEach } from "vitest";
import { isEnabled } from "../lib/flags";

describe("isEnabled", () => {
  beforeEach(() => {
    delete process.env.FLAG_BETA;
    delete process.env.FLAG_NEW_UI;
  });

  it("returns fallback when no override exists", () => {
    expect(isEnabled("beta", false)).toBe(false);
    expect(isEnabled("new_ui", true)).toBe(true);
  });

  it("uses env var when present", () => {
    process.env.FLAG_BETA = "true";
    expect(isEnabled("beta", false)).toBe(true);
  });

  it("caches result for 5 minutes", () => {
    process.env.FLAG_BETA = "true";
    const v1 = isEnabled("beta", false);
    process.env.FLAG_BETA = "false";
    const v2 = isEnabled("beta", false);
    expect(v1).toBe(v2);
    expect(v1).toBe(true);
  });
});
