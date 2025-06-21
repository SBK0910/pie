'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PersonalInfo, { PersonalInfoData } from '@/components/PersonalInfo';
import FinancialInfo, { FinancialInfoData } from '@/components/FinancialInfo';
import InvestmentInfo from '@/components/InvestmentInfo';
import { Progress } from '@/components/ui/progress';
import { InvestmentInfo as InvestmentInfoType } from '@/schemas/investment';

type FormData = {
  personal: PersonalInfoData;
  financial: FinancialInfoData;
  investment: InvestmentInfoType;
};

export default function Home() {
  const router = useRouter();
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
    const finalData = { ...formData, investment: data };
    // Here you would typically submit all form data to your backend
    console.log('Form submission:', finalData);
    // Navigate to chat page after submission
    router.push('/chat');
  };

  const handleInvestmentBack = (data: InvestmentInfoType) => {
    setFormData(prev => ({ ...prev, investment: data }));
    setStep('financial');
  };

  const steps = [
    { id: 'personal', label: 'Personal' },
    { id: 'financial', label: 'Financial' },
    { id: 'investment', label: 'Investment' },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-3xl mx-auto p-6">
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Step {currentStepIndex + 1} of {steps.length}</span>
              <span className="font-medium">{steps[currentStepIndex]?.label}</span>
            </div>
            <Progress value={progress} className="h-1.5" />
            <div className="flex justify-between text-sm text-muted-foreground">
              {steps.map((stepItem, index) => (
                <span 
                  key={stepItem.id}
                  className={`transition-colors ${index <= currentStepIndex ? 'font-medium text-foreground' : 'opacity-60'}`}
                >
                  {stepItem.label}
                </span>
              ))}
            </div>
          </div>
          
          {/* Form Content */}
          <div className="pt-12">
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
        </div>
      </main>
    </div>
  );
}
