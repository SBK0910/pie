import { ProfilingType, profilingSchema } from "@/schemas/validators/profiling.validators";

const API_BASE = '/api';

export const api = {
    async profiling(data:ProfilingType) {
        const response = await fetch(`${API_BASE}/profiling`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        
        const result = await profilingSchema.safeParse(await response.json());
        if (!result.success){
            throw new Error(result.error.errors.map((error) => error.message).join(', '));
        }

        return result.data;
    }
}