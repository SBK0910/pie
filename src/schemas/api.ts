import { z } from "zod";
import { financialInfoSchema } from "./validators/profiling.validators";
import { investmentInfoSchema } from "./validators/profiling.validators";

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
    