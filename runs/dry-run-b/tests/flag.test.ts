import { describe, it, expect, beforeEach } from "vitest";
import { isEnabled } from "../lib/flag";

describe("isEnabled (dry-run-b)", () => {
  beforeEach(() => {
    delete process.env.FLAG_DRY_RUN_A;
    delete process.env.FLAG_DRY_RUN_B;
  });

  it("returns default false when env unset", () => {
    expect(isEnabled("DRY_RUN_A")).toBe(false);
  });

  it("env override FLAG_DRY_RUN_A=true returns true", () => {
    process.env.FLAG_DRY_RUN_A = "true";
    expect(isEnabled("DRY_RUN_A")).toBe(true);
  });

  it("cache hit returns same value without re-reading env", () => {
    process.env.FLAG_DRY_RUN_A = "true";
    expect(isEnabled("DRY_RUN_A")).toBe(true);
    delete process.env.FLAG_DRY_RUN_A;
    expect(isEnabled("DRY_RUN_A")).toBe(true);
  });
});
