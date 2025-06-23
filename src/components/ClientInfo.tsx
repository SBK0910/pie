'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import FinancialInfo from '@/components/FinancialInfo';
import { ChatInterface } from '@/components/ChatInterface';
import InvestmentInfo from '@/components/InvestmentInfo';
import type { FinancialInfoData } from '@/schemas/financial';
import type { InvestmentInfoData } from '@/schemas/investment';
import { api } from '@/lib/api/client';

interface ClientInfoProps {
    defaultStep: 'financial' | 'investment' | 'chat';
    defaultValues: {
        financial: FinancialInfoData;
        investment: InvestmentInfoData;
    };
}

export default function ClientInfo({ defaultStep, defaultValues }: ClientInfoProps) {
    const [step, setStep] = useState<'financial' | 'investment' | 'chat'>(defaultStep);
    const [formData, setFormData] = useState<{
        financial: FinancialInfoData;
        investment: InvestmentInfoData;
    }>(defaultValues);

    const handleSubmit = async (data: InvestmentInfoData) => {
        try {
            const result = await api.profiling({
                financial: formData.financial,
                investment: data
            });

            if (result.error) {
                toast.error(result.error);
                return;
            }

            setFormData((prev) => ({ ...prev, investment: data }));
            setStep('chat');

            toast.success('Profile saved successfully');
        } catch (error) {
            console.error('Error saving profile:', error);
            toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
        }
    }

    return (
        <div className="min-h-screen">
            <main className="max-w-3xl mx-auto">
                <div className="space-y-8">
                    {step === 'financial' && (
                        <div className='flex flex-col gap-6 p-6 pt-[15vh]'>
                            <FinancialInfo
                                data={formData.financial}
                                onNext={(data) => {
                                    setFormData((prev) => ({ ...prev, financial: data }));
                                    setStep('investment');
                                }}
                            />
                        </div>
                    )}
                    {step === 'investment' && (
                        <div className='flex flex-col gap-6 h-full p-6 pt-[15vh]'>
                            <InvestmentInfo
                                data={formData.investment}
                                onNext={handleSubmit}
                                onPrevious={(data) => {
                                    setFormData((prev) => ({ ...prev, investment: data }));
                                    setStep('financial');
                                }}
                            />
                        </div>
                    )}
                    {step === 'chat' && (
                        <div className='flex flex-col gap-6 h-full'>
                            <ChatInterface />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}