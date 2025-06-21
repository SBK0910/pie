'use client';

import { useState } from 'react';
import PersonalInfo, { PersonalInfoData } from '@/components/PersonalInfo';
import FinancialInfo, { FinancialInfoData } from '@/components/FinancialInfo';
import InvestmentInfo from '@/components/InvestmentInfo';
import { InvestmentInfo as InvestmentInfoType } from '@/schemas/investment';

type FormData = {
  personal: PersonalInfoData;
  financial: FinancialInfoData;
  investment: InvestmentInfoType;
};

export default function Home() {
  const [step, setStep] = useState<'personal' | 'financial' | 'investment'>('personal');
  const [formData, setFormData] = useState<FormData>({
    personal: { name: '', dob: new Date(), occupation: 'Student' },
    financial: { yearlySavings: 0, emergencyFunds: 0, dependents: 0, jobSecurity: 0 },
    investment: { retirementTimeline: 0, investmentObjective: 'growth' }
  });

  const handlePersonalSubmit = (data: PersonalInfoData) => {
    setFormData(prev => ({ ...prev, personal: data }));
    setStep('financial');
  };

  const handleFinancialSubmit = (data: FinancialInfoData) => {
    setFormData(prev => ({ ...prev, financial: data }));
    setStep('investment');
  };

  const handleFinancialBack = (data: FinancialInfoData) => {
    setFormData(prev => ({ ...prev, financial: data }));
    setStep('personal');
  };

  const handleInvestmentSubmit = (data: InvestmentInfoType) => {
    setFormData(prev => ({ ...prev, investment: data }));
    // Here you would typically submit all form data to your backend
    console.log('Form submission:', { ...formData, investment: data });
    // For demo purposes, we'll just go back to the financial step
    setStep('financial');
  };

  const handleInvestmentBack = (data: InvestmentInfoType) => {
    setFormData(prev => ({ ...prev, investment: data }));
    setStep('financial');
  };

  const steps = [
    { id: 'personal', label: 'Personal Info' },
    { id: 'financial', label: 'Financial Info' },
    { id: 'investment', label: 'Investment Info' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 flex flex-col items-center p-4">
        <div className="w-full max-w-md">
          {step === 'personal' && (
            <PersonalInfo 
              data={formData.personal} 
              onNext={handlePersonalSubmit}
            />
          )}
          
          {step === 'financial' && (
            <FinancialInfo 
              data={formData.financial} 
              onBack={handleFinancialBack} 
              onNext={handleFinancialSubmit}
            />
          )}
          
          {step === 'investment' && (
            <InvestmentInfo
              data={formData.investment}
              onBack={handleInvestmentBack}
              onSubmit={handleInvestmentSubmit}
            />
          )}
        </div>
      </main>
    </div>
  );
}
