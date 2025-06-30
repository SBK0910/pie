import { z } from "zod";

const createTraitSchema = (trait: string, values: [string, ...string[]]) => {
    const valueEnum = z.enum(values as [string, ...string[]]);
    
    return z.discriminatedUnion("isComplete", [
        z.object({
            trait: z.literal(trait),
            value: valueEnum,
            isComplete: z.literal(true)
        }),
        z.object({
            trait: z.literal(trait),
            value: valueEnum.nullable(),
            isComplete: z.literal(false),
            response: z.string()
        })
    ]);
};

export const aiMessageSchema = z.union([
    createTraitSchema('investmentObjective', ['Preserve', 'Income', 'Growth', 'Aggressive']),
    createTraitSchema('marketReaction', ['Panic sell', 'Partial sell', 'Hold', 'Buy more']),
    createTraitSchema('decisionMaking', ['Emotional', 'Herd following', 'Advice based', 'Analytical', 'Plan driven']),
    createTraitSchema('investmentHorizon', ['Very short term', 'Short term', 'Medium term', 'Long term']),
    createTraitSchema('riskComfort', ['Very uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very comfortable']),
    createTraitSchema('marketVolatility', ['Avoid', 'Reduce', 'Maintain', 'Increase']),
]);

export type AIMessage = z.infer<typeof aiMessageSchema>;