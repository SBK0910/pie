'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { DollarSign, Shield, ArrowRight } from 'lucide-react';
import { useProfiling } from '../providers/profiling-provider';
import { basicFinancialProfile, BasicFinancialProfileType } from '@/schemas/validators/basicprofile.validator';
import { FormSelectField } from './reusable/FormSelect';
import { FormSliderField } from './reusable/FormSlider';

export default function FinancialForm() {
    const {
        profiling: {
            formData: {
                basicProfile
            }
        },
        updateBasicFinancial,
        updateStage
    } = useProfiling()

    const form = useForm<BasicFinancialProfileType>({
        resolver: zodResolver(basicFinancialProfile),
        defaultValues: basicProfile,
        mode: 'onChange'
    });

    const onSubmit = (values: BasicFinancialProfileType) => {
        updateBasicFinancial(values);
        updateStage('basic_risk_profile');
    };

    return (
        <div className="w-full max-w-2xl mx-auto space-y-12">
            <div>
                <h1 className="text-2xl font-semibold">Financial Information</h1>
                <p className="text-muted-foreground">Please share your financial details to help us better understand your situation.</p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Yearly Savings */}
                    <FormSliderField
                        name="yearlySavings"
                        label={<>
                            <DollarSign className="h-4 w-4" />
                            Yearly Savings
                        </>}
                        control={form.control}
                        min={0}
                        max={5000000}
                        step={10000}
                        labelFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <FormSliderField
                        name="debt"
                        label={<>
                            <DollarSign className="h-4 w-4" />
                            Debt
                        </>}
                        control={form.control}
                        min={0}
                        max={5000000}
                        step={10000}
                        labelFormatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Emergency Funds */}
                        <FormSelectField
                            name="emergencyFunds"
                            label={<>
                                <Shield className="h-4 w-4" />
                                Emergency Funds
                            </>}
                            options={[
                                'Less than 3 months',
                                '3 - 6 months',
                                '6 months to 1 year',
                                'More than 1 year'
                            ].map(option => ({
                                value: option,
                                label: option
                            }))}
                            control={form.control}
                            className="w-full col-span-2"
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="grid grid-cols-1 gap-4 pt-2">
                        <Button
                            type="submit"
                            className="h-10 w-full text-sm font-medium flex items-center justify-center gap-2"
                            size="lg"
                        >
                            <span>Continue</span>
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}