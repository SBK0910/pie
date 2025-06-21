'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalInfo, { PersonalInfoData } from '@/components/PersonalInfo';
import FinancialInfo, { FinancialInfoData } from '@/components/FinancialInfo';
import Header from '@/components/Header';

type FormData = {
    personal: PersonalInfoData;
    financial: FinancialInfoData;
};

export default function Home() {
    const router = useRouter();
    const [step, setStep] = useState<'personal' | 'financial'>('personal');
    const [formData, setFormData] = useState<FormData>({
        personal: {
            name: '',
            dob: new Date(),
            occupation: 'Student',
        },
        financial: {
            yearlySavings: 0,
            emergencyFunds: 'Less than 3 months',
            dependents: 'Only myself',
            jobSecurity: 'Not secure',
            investmentObjective: 'Growth',
            retirementTimeline:'5 - 15 years',
        },
    });

    return (
        <div className="min-h-screen">
            <Header />
            <main className="max-w-xl mx-auto p-6">
                <div className="space-y-8">
                    <div className="">
                        {step === 'personal' && (
                            <PersonalInfo
                                data={formData.personal}
                                onNext={(data) => {
                                    setFormData((prev) => ({ ...prev, personal: data }));
                                    setStep('financial');
                                }}
                            />
                        )}

                        {step === 'financial' && (
                            <FinancialInfo
                                data={formData.financial}
                                onBack={(data) => {
                                    setFormData((prev) => ({ ...prev, financial: data }));
                                    setStep('personal');
                                }}
                                onNext={(data) => {
                                    setFormData((prev) => ({ ...prev, financial: data }));
                                    router.push('/chat');
                                }}
                            />
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
