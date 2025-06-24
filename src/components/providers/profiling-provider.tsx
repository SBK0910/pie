'use client';

import { createContext, useState, useContext } from "react";
import type { ProfilingType, FinancialInfoType, InvestmentInfoType } from "@/schemas/validators/profiling.validators";

export const ProfilingContext = createContext<{
    profiling: ProfilingType;
    updateFinancial: (financial: FinancialInfoType) => void;
    updateInvestment: (investment: InvestmentInfoType) => void;
    updateStage: (stage: ProfilingType['stage']) => void;
} | null>(null);

interface ProfilingProviderProps {
    children: React.ReactNode;
    defaultProfiling: ProfilingType;
}
    
export default function ProfilingProvider({ children, defaultProfiling }: ProfilingProviderProps) {
    const [profiling, setProfiling] = useState<ProfilingType>(defaultProfiling);

    const updateFinancial = (financial: FinancialInfoType) => {
        setProfiling({
            ...profiling,
            formData: {
                ...profiling.formData,
                financial,
            },
        });
    };

    const updateInvestment = (investment: InvestmentInfoType) => {
        setProfiling({
            ...profiling,
            formData: {
                ...profiling.formData,
                investment,
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
            updateFinancial,
            updateInvestment,
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