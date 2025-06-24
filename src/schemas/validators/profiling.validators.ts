import { z } from 'zod';

export const financialInfoSchema = z.object({
    yearlySavings: z.number().min(0, "Yearly savings must be a positive number"),
    emergencyFunds: z.enum(['Less than 3 months', '3 - 6 months', '6 months to 1 year', 'More than 1 year'], {
        errorMap: () => ({
            message: "Invalid emergency fund selection",
        }),
    }),
    dependents: z.enum(['Only myself', 'Two people including myself', '3 - 4 people other than myself', 'More than 4 people other than myself'], {
        errorMap: () => ({
            message: "Invalid dependents selection",
        }),
    }),
});

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

export const profilingSchema = z.object({
    stage: z.enum(['financial', 'investment', 'chat'], {
        errorMap: () => ({ message: "Invalid stage selection" }),
    }),
    formData: z.object({
        financial: financialInfoSchema,
        investment: investmentInfoSchema,
    }),
});

export type FinancialInfoType = z.infer<typeof financialInfoSchema>;
export type InvestmentInfoType = z.infer<typeof investmentInfoSchema>;
export type ProfilingType = z.infer<typeof profilingSchema>;