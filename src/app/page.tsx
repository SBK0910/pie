'use client';

import { useState } from 'react';
import FinancialInfo, { FinancialInfoData } from '@/components/FinancialInfo';
import Header from '@/components/Header';
import { ChatInterface } from '@/components/ChatInterface';

type FormData = {
    financial: FinancialInfoData;
};

export default function Home() {
    const [step, setStep] = useState<'financial' | 'chat'>('financial');
    const [formData, setFormData] = useState<FormData>({
        financial: {
            yearlySavings: 0,
            emergencyFunds: 'Less than 3 months',
            dependents: 'Only myself',
            jobSecurity: 'Not secure',
            investmentObjective: 'Growth',
            retirementTimeline: '5 - 15 years',
        },
    });

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-xl mx-auto">
                <div className="space-y-8">
                    {step === 'financial' && (
                        <div className='flex flex-col gap-6 p-6'>
                            <h1 className="text-2xl font-semibold">Financial Information</h1>
                            <FinancialInfo
                                data={formData.financial}
                                onNext={(data) => {
                                    setFormData((prev) => ({ ...prev, financial: data }));
                                    setStep('chat');
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
