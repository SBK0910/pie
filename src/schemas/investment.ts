import { z } from "zod";

export const investmentInfoSchema = z.object({
    jobSecurity: z.enum(['Not secure', 'Somewhat secure', 'Secure', 'Very secure', 'Job flexibility'], {
        errorMap: () => ({ message: "Invalid job security selection" }),
    }),
    retirementTimeline: z.enum(['Less than 5 years', '5 - 15 years', '15 - 25 years', 'More than 25 years'], {
        errorMap: () => ({ message: "Invalid retirement timeline selection" }),
    }),
    investmentObjective: z.enum(['Preserve', 'Income', 'Growth', 'Aggressive'], {
        errorMap: () => ({ message: "Invalid investment objective selection" }),
    }),
});

export type InvestmentInfoData = z.infer<typeof investmentInfoSchema>;
