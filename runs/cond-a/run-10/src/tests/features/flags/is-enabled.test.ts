/**
 * src/tests/features/flags/is-enabled.test.ts
 *
 * Run 8 — Condition A. Sync variant, 4 cases covering env=true,
 * env=false, default fallback, and 5-minute cache hit behavior.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isEnabled } from "@/features/flags/lib/is-enabled";

const FLAG_ENV_NAMES = [
  "FLAG_STRIPE_V2",
  "FLAG_APPLE_PAY",
  "FLAG_INVITE_ONLY",
  "FLAG_STAGING_MODE",
  "FLAG_MULTI_TENANT",
] as const;

describe("isEnabled (Run 8 — sync, dual-Map cache)", () => {
  beforeEach(() => {
    for (const key of FLAG_ENV_NAMES) {
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of FLAG_ENV_NAMES) {
      delete process.env[key];
    }
  });

  it("returns env=true when FLAG_<KEY>=true", () => {
    process.env.FLAG_STRIPE_V2 = "true";
    expect(isEnabled("STRIPE_V2")).toBe(true);
  });

  it("returns env=false when FLAG_<KEY>=false", () => {
    process.env.FLAG_APPLE_PAY = "false";
    expect(isEnabled("APPLE_PAY", true)).toBe(false);
  });

  it("falls back to the default when no env var is set", () => {
    expect(isEnabled("INVITE_ONLY", false)).toBe(false);
    expect(isEnabled("MULTI_TENANT", true)).toBe(true);
  });

  it("caches the resolved value across env var changes for 5 minutes", () => {
    process.env.FLAG_STAGING_MODE = "true";
    const first = isEnabled("STAGING_MODE", false);
    process.env.FLAG_STAGING_MODE = "false";
    const second = isEnabled("STAGING_MODE", true);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });
});
