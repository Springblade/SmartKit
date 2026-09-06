/**
 * src/tests/features/flags/is-enabled.test.ts
 *
 * Run 7 — Condition A. async variants of the standard 3 cases
 * (env override, default value, cache hit) plus a case that pins
 * env-true vs env-false precedence over a `true` fallback.
 */
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { isEnabled } from "@/features/flags/lib/is-enabled";

const FLAG_ENV_KEYS = [
  "FLAG_NEW_PRICING",
  "FLAG_SEPAY_CHECKOUT",
  "FLAG_AI_ASSISTANT_V1",
  "FLAG_AUDIT_LOG",
  "FLAG_GRAPHQL_ENDPOINT",
] as const;

describe("isEnabled (Run 7 — async)", () => {
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

  it("returns env=true when FLAG_<KEY>=true is set", async () => {
    process.env.FLAG_NEW_PRICING = "true";
    await expect(isEnabled("new_pricing", false)).resolves.toBe(true);
  });

  it("returns env=false even when fallback is true", async () => {
    process.env.FLAG_AUDIT_LOG = "false";
    await expect(isEnabled("audit_log", true)).resolves.toBe(false);
  });

  it("returns the default value when no env var is set", async () => {
    await expect(isEnabled("graphql_endpoint", true)).resolves.toBe(true);
    await expect(isEnabled("ai_assistant_v1", false)).resolves.toBe(false);
  });

  it("caches the resolved value for 5 minutes and ignores later env changes", async () => {
    process.env.FLAG_SEPAY_CHECKOUT = "true";
    const first = await isEnabled("sepay_checkout", false);
    process.env.FLAG_SEPAY_CHECKOUT = "false";
    const second = await isEnabled("sepay_checkout", true);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });
});
