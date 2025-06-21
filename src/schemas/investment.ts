import { z } from 'zod';

export const retirementTimelineOptions = [
  { value: 0, label: "<5 years" },
  { value: 2, label: "5-15 years" },
  { value: 4, label: "15-25 years" },
  { value: 6, label: "25+ years" },
] as const;

export const investmentObjectiveOptions = [
  { value: 'preserve', label: "Capital Preservation" },
  { value: 'income', label: "Income Generation" },
  { value: 'growth', label: "Balanced Growth" },
  { value: 'aggressive', label: "Aggressive Growth" },
] as const;

export const investmentSchema = z.object({
  retirementTimeline: z.number().min(0).max(6, "Please select a valid option"),
  investmentObjective: z.enum(['preserve', 'income', 'growth', 'aggressive']),
});

export type InvestmentInfo = z.infer<typeof investmentSchema>;
