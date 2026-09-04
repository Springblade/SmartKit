import { z } from "zod";

export const FlagKeySchema = z.enum(["DRY_RUN_A", "DRY_RUN_B"]);
export type FlagKey = z.infer<typeof FlagKeySchema>;
