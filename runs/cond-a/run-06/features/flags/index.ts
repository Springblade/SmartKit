/**
 * features/flags/index.ts — public API barrel.
 */
export { isEnabled, FlagKeySchema } from "./lib/is-enabled";
export { FLAG_KEYS, isFlagKey } from "./types/flags";
export type { FlagKey } from "./types/flags";
