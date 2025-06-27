'use client';

import { createContext, useState, useContext } from "react";
import type { BasicFinancialProfileType, BasicProfileType, BasicRiskProfileType } from "@/schemas/validators/basicprofile.validator";

export type ProfilingType = {
    stage: 'basic_financial_profile' | 'basic_risk_profile' | 'chat';
    formData: {
        basicProfile: BasicProfileType;
        profileId: string;
    };
};

export const ProfilingContext = createContext<{
    profiling: ProfilingType;
    updateBasicFinancial: (financial: BasicFinancialProfileType) => void;
    updateBasicRisk: (risk: BasicRiskProfileType) => void;
    updateStage: (stage: ProfilingType['stage']) => void;
} | null>(null);

interface ProfilingProviderProps {
    children: React.ReactNode;
    defaultProfiling: ProfilingType;
}
    
export default function ProfilingProvider({ children, defaultProfiling }: ProfilingProviderProps) {
    const [profiling, setProfiling] = useState<ProfilingType>(defaultProfiling);

    const updateBasicFinancial = (financial: BasicFinancialProfileType) => {
        setProfiling({
            ...profiling,
            formData: {
                ...profiling.formData,
                basicProfile: {
                    ...profiling.formData.basicProfile,
                    ...financial,
                },
            },
        });
    };

    const updateBasicRisk = (risk: BasicRiskProfileType) => {
        setProfiling({
            ...profiling,
            formData: {
                ...profiling.formData,
                basicProfile: {
                    ...profiling.formData.basicProfile,
                    ...risk,
                },
            },
        });
    };

    const updateStage = (stage: ProfilingType['stage']) => {
        setProfiling({
            ...profiling,
            stage,
        });
    };

    return (
        <ProfilingContext.Provider value={{
            profiling,
            updateBasicFinancial,
            updateBasicRisk,
            updateStage,
        }}>
            {children}
        </ProfilingContext.Provider>
    );
}

export const useProfiling = () => {
    const context = useContext(ProfilingContext);
    if (!context) {
        throw new Error("useProfiling must be used within a ProfilingProvider");
    }
    return context;
};  