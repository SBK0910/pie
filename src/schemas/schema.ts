import { z } from "zod";
import { financialInfoSchema } from "./financial";
import { investmentInfoSchema } from "./investment";

export const profilingSchema = z.object({
    financial: financialInfoSchema,
    investment: investmentInfoSchema,
});

export type ProfilingData = z.infer<typeof profilingSchema>;
