/**
 * features/flags — public API.
 *
 * Run 8 — Condition A. Minimal barrel — only the utility, schema, and
 * type are re-exported. Runtime helpers (e.g. ALL_FLAG_KEYS, isValidFlagKey)
 * are deliberately omitted from the public surface so callers depend on
 * the Zod schema directly.
 */
export { isEnabled, FlagKeySchema } from "./lib/is-enabled";
export type { FlagKey } from "./types/flags";
