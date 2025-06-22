'use client';

import { useState } from 'react';
import FinancialInfo from '@/components/FinancialInfo';
import { ChatInterface } from '@/components/ChatInterface';
import InvestmentInfo from '@/components/InvestmentInfo';
import type { FinancialInfoData } from '@/schemas/financial';
import type { InvestmentInfoData } from '@/schemas/investment';

type FormData = {
    financial: FinancialInfoData;
    investment: InvestmentInfoData;
};

export default function Home() {
    const [step, setStep] = useState<'financial' | 'investment' | 'chat'>('financial');
    const [formData, setFormData] = useState<FormData>({
        financial: {
            yearlySavings: 0,
            emergencyFunds: 'Less than 3 months',
            dependents: 'Only myself',
        },
        investment: {
            jobSecurity: 'Not secure',
            retirementTimeline: '5 - 15 years',
            investmentObjective: 'Growth',
        },
    });

    return (
        <div className="min-h-screen">
            <main className="max-w-xl mx-auto">
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
                                onNext={(data) => {
                                    setFormData((prev) => ({ ...prev, investment: data }));
                                    setStep('chat');
                                }}
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
