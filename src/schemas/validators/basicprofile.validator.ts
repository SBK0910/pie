import { z } from "zod";

export type BasicProfileType = z.infer<typeof basicProfileSchema>;

export type BasicFinancialProfileType = z.infer<typeof basicFinancialProfile>;

export type BasicRiskProfileType = z.infer<typeof basicRiskProfile>;

export const basicFinancialProfile = z.object({
    yearlySavings: z.number().min(0, "Yearly savings must be a positive number"),
    debt: z.number().min(0, "Debt must be a positive number"),
    emergencyFunds: z.enum(['Less than 3 months', '3 - 6 months', '6 months to 1 year', 'More than 1 year'], {
        errorMap: () => ({
            message: "Invalid emergency fund selection",
        }),
    }),
})

export const basicRiskProfile = z.object({
    dependents: z.enum(['Only myself', 'Two people including myself', '3 - 4 people other than myself', 'More than 4 people other than myself'], {
        errorMap: () => ({
            message: "Invalid dependents selection",
        }),
    }),
    jobSecurity: z.enum(['Not secure', 'Somewhat secure', 'Secure', 'Very secure', 'Job flexibility'], {
        errorMap: () => ({
            message: "Invalid job security selection",
        }),
    }),
    retirementTimeline: z.enum(['Less than 5 years', '5 - 15 years', '15 - 25 years', 'More than 25 years'], {
        errorMap: () => ({
            message: "Invalid retirement timeline selection",
        }),
    }),
})

export const basicProfileSchema = z.object({
    yearlySavings: z.number().min(0, "Yearly savings must be a positive number"),
    debt: z.number().min(0, "Debt must be a positive number"),
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
    jobSecurity: z.enum(['Not secure', 'Somewhat secure', 'Secure', 'Very secure', 'Job flexibility'], {
        errorMap: () => ({
            message: "Invalid job security selection",
        }),
    }),
    retirementTimeline: z.enum(['Less than 5 years', '5 - 15 years', '15 - 25 years', 'More than 25 years'], {
        errorMap: () => ({
            message: "Invalid retirement timeline selection",
        }),
    }),
});


export const basicProfileApiSchema = z.object({
    basicProfile: basicProfileSchema,
    profileId: z.string(),
});