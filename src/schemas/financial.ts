import { z } from 'zod';

export const financialInfoSchema = z.object({
  yearlySavings: z.number().min(0, "Yearly savings must be a positive number"),
  emergencyFunds: z.number().int().min(0).max(3, "Invalid emergency fund selection"),
  dependents: z.number().int().min(0).max(3, "Invalid dependents selection"),
  jobSecurity: z.number().int().min(0).max(4, "Invalid job security selection"),
});

export type FinancialInfo = z.infer<typeof financialInfoSchema>;

// Option values for form fields
export const emergencyFundsOptions = [
  { value: 0, label: "Less than 3 months" },
  { value: 1, label: "3 - 6 months" },
  { value: 2, label: "6 months to 1 year" },
  { value: 3, label: "More than 1 year" },
];

export const dependentsOptions = [
  { value: 3, label: "Only myself" },
  { value: 2, label: "Two people including myself" },
  { value: 1, label: "3 - 4 people other than myself" },
  { value: 0, label: "More than 4 people other than myself" },
];

export const jobSecurityOptions = [
  { value: 0, label: "Not secure (contract/uncertain)" },
  { value: 1, label: "Somewhat secure (some uncertainty)" },
  { value: 2, label: "Secure (stable employment)" },
  { value: 3, label: "Very secure (government/tenure)" },
  { value: 4, label: "Job flexibility (easy to find work)" },
];
