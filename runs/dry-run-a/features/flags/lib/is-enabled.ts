import "server-only";
import { z } from "zod";
import { FlagKeySchema, type FlagKey } from "../types/flags";

const cache = new Map<string, { value: boolean; expiresAt: number }>();
const TTL_MS = 5 * 60 * 1000;

export type IsEnabledOptions = { userId?: string };

export function isEnabled(flagKey: FlagKey, userId?: string): boolean {
  const parsed = FlagKeySchema.parse(flagKey);
  const cacheKey = `${parsed}::${userId ?? "_"}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }
  const envVar = `FLAG_${parsed.toUpperCase().replace(/-/g, "_")}`;
  const envVal = process.env[envVar];
  const value = envVal === "true" ? true : envVal === "false" ? false : false;
  cache.set(cacheKey, { value, expiresAt: now + TTL_MS });
  return value;
}
