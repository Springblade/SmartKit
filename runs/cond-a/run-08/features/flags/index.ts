/**
 * features/flags — public API.
 *
 * Run 6 — Condition A. Barrel re-exports the flag utility, schema, and
 * types so consumers can `import { isEnabled, FlagKey } from "@/features/flags"`.
 */
export { isEnabled, FlagKeySchema } from "./lib/is-enabled";
export { ALL_FLAG_KEYS, isFlagKey } from "./types/flags";
export type { FlagKey } from "./types/flags";
