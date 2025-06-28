import { basicProfileApiSchema, BasicProfileType } from "@/schemas/validators/basicprofile.validator";

const API_BASE = '/api';

export type ApiResponse = {
    success: boolean;
    data?: {
        basicProfile: BasicProfileType;
        profileId: string;
    };
    error?: string;
    details?: unknown;
};

export const api = {
    async saveProfile(profileData: { basicProfile: BasicProfileType; profileId: string }): Promise<ApiResponse> {
        const response = await fetch(`${API_BASE}/v1/basic`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(profileData),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            return {
                success: false,
                error: result.error || 'Failed to save profile',
                details: result.details
            };
        }

        const parsed = basicProfileApiSchema.safeParse(result);
        
        if (!parsed.success) {
            console.error('Validation error:', parsed.error);
            return {
                success: false,
                error: 'Invalid response from server',
                details: parsed.error
            };
        }

        return {
            success: true,
            data: parsed.data
        };
    }
};