'use client';

import { useState } from 'react';
import { toast } from 'sonner';
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

    const handleSubmit = async (data: InvestmentInfoData) => {
        try {
            const response = await fetch('/api/profiling', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    financial: formData.financial, 
                    investment: data 
                }),
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Failed to save profile');
            }
            
            toast.success('Profile saved successfully!');
            setFormData(prev => ({ ...prev, investment: data }));
            setStep('chat');
        } catch (error) {
            console.error('Error saving profile:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
            toast.error(errorMessage);
            throw error; // Re-throw to let the form handle it
        }
    };

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
