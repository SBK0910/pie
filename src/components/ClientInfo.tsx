'use client';

import { useProfiling } from '@/components/providers/profiling-provider';
import FinancialForm from './forms/FinancialForm';
import InvestmentForm from './forms/InvestmentForm';
import { ChatInterface } from './ChatInterface';

export default function ClientInfo() {
    const { profiling: {
        stage
    }} = useProfiling();

    return (
        <div className="w-full max-w-4xl mx-auto p-4 md:p-6">
            {stage === 'financial' && (
                <FinancialForm />
            )}
            
            {stage === 'investment' && (
                <InvestmentForm />
            )}
            
            {stage === 'chat' && (
                <ChatInterface />
            )}
        </div>
    );
}