'use client';

import { useState } from 'react';
import PersonalInfo, { PersonalInfoData } from '@/components/PersonalInfo';
import FinancialInfo, { FinancialInfoData } from '@/components/FinancialInfo';

type FormData = {
  personal: PersonalInfoData;
  financial: FinancialInfoData;
};

export default function Home() {
  const [step, setStep] = useState<'personal' | 'financial'>('personal');
  const [formData, setFormData] = useState<FormData>({
    personal: { name: '', dob: new Date(), occupation: 'Student' },
    financial: { yearlySavings: 0, emergencyFunds: 0, dependents: 0, jobSecurity: 0 }
  });

  const handlePersonalSubmit = (data: PersonalInfoData) => {
    setFormData(prev => ({ ...prev, personal: data }));
    setStep('financial');
  };

  const handleFinancialSubmit = (data: FinancialInfoData) => {
    setFormData(prev => ({ ...prev, financial: data }));
    setStep('financial');
  };

  const handleFinancialBack = (data: FinancialInfoData) => {
    setFormData(prev => ({ ...prev, financial: data }));
    setStep('personal');
  };

  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'financial', label: 'Financial Info' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          {step === 'personal' ? (
            <PersonalInfo 
              data={formData.personal} 
              onNext={handlePersonalSubmit}
            />
          ) : (
            <FinancialInfo 
              data={formData.financial} 
              onBack={handleFinancialBack} 
              onNext={handleFinancialSubmit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
