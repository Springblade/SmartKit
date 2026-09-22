/**
 * src/tests/features/flags/is-enabled.test.ts
 *
 * Run 6 — Condition A. ≥3 cases: env override, default value, cache hit.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isEnabled } from "@/features/flags/lib/is-enabled";

const FLAG_ENV_KEYS = [
  "FLAG_DARK_MODE",
  "FLAG_BETA_FEATURES",
  "FLAG_ANALYTICS",
  "FLAG_NEW_DASHBOARD",
] as const;

describe("isEnabled (condition A)", () => {
  beforeEach(() => {
    for (const key of FLAG_ENV_KEYS) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of FLAG_ENV_KEYS) {
      delete process.env[key];
    }
  });

  it("returns the default value when neither userId nor env are set", () => {
    expect(isEnabled("DARK_MODE", false)).toBe(false);
    expect(isEnabled("BETA_FEATURES", true)).toBe(true);
  });

  it("returns the env override when FLAG_<KEY> is set", () => {
    process.env.FLAG_DARK_MODE = "true";
    expect(isEnabled("DARK_MODE", false)).toBe(true);
    process.env.FLAG_DARK_MODE = "false";
    expect(isEnabled("DARK_MODE", true)).toBe(false);
  });

  it("returns a cached value on the second call without re-reading env", () => {
    process.env.FLAG_BETA_FEATURES = "true";
    const first = isEnabled("BETA_FEATURES", false);
    process.env.FLAG_BETA_FEATURES = "false";
    const second = isEnabled("BETA_FEATURES", false);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });

  it("throws on an invalid flag key (Zod boundary)", () => {
    // @ts-expect-error: invalid key on purpose
    expect(() => isEnabled("not_a_real_flag", false)).toThrow();
  });
});
