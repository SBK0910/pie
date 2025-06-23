import { ProfilingData } from "@/schemas/schema";
import { profilingPutSchema } from "@/schemas/api";

const API_BASE = '/api';

export const api = {
    async profiling(data: ProfilingData) {
        const response = await fetch(`${API_BASE}/profiling`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await profilingPutSchema.safeParse(await response.json());
        if (!result.success){
            throw new Error(result.error.errors.map((error) => error.message).join(', '));
        }

        return result.data;
    }
}