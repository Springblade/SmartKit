type FlagKey = "DRY_RUN_A" | "DRY_RUN_B";

const cache = new Map<string, { value: boolean; expiresAt: number }>();
const TTL_MS = 5 * 60 * 1000;

export function isEnabled(flagKey: FlagKey, userId?: string): boolean {
  if (typeof flagKey !== "string") {
    throw new TypeError("flagKey must be a string");
  }
  const cacheKey = `${flagKey}::${userId ?? "_"}`;
  const now = Date.now();
  const cached = cache.get(cacheKey);
  if (cached && cached.expiresAt > now) {
    return cached.value;
  }
  const envVar = `FLAG_${flagKey.toUpperCase()}`;
  const envVal = process.env[envVar];
  const value = envVal === "true" ? true : envVal === "false" ? false : false;
  cache.set(cacheKey, { value, expiresAt: now + TTL_MS });
  return value;
}
