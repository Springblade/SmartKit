/**
 * features/flags — public API.
 *
 * Run 7 — Condition A. Barrel exposing the async isEnabled utility,
 * the Zod-derived FlagKey schema, and the runtime helpers.
 */
export { isEnabled, FlagKeySchema } from "./lib/is-enabled";
export { getFlagKeys, isValidFlagKey } from "./types/flags";
export type { FlagKey } from "./types/flags";
