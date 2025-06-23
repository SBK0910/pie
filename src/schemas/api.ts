import { z } from "zod";
import { financialInfoSchema } from "./financial";
import { investmentInfoSchema } from "./investment";

export const profilingPutSchema = z.object({
    data: z.object({
        financial: financialInfoSchema,
        investment: investmentInfoSchema,
        stage: z.enum(['static', 'chat'],{
            errorMap: () => ({
                message: 'Invalid stage'
            })
        })
    }).optional(),
    error: z.string().optional()
})
    