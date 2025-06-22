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

export type FinancialInfoData = z.infer<typeof financialInfoSchema>;
