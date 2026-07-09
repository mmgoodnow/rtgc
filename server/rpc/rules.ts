import { z } from "zod";
import { getRules, updateRules } from "../db.ts";
import { protectedProcedure, router } from "../trpc.ts";

const ruleSchema = z.object({
  matchType: z.literal("substring"),
  substring: z.string(),
  type: z.string().trim().min(1),
});

export const rules = router({
  getRules: protectedProcedure.query(getRules),
  updateRules: protectedProcedure
    .input(z.array(ruleSchema))
    .mutation((t) => updateRules(t.input)),
});
