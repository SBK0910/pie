'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { financialInfoSchema } from '@/schemas/validators/profiling.validators';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { DollarSign, Shield, Users, ArrowRight } from 'lucide-react';
import { useProfiling } from '../providers/profiling-provider';
import { FinancialInfoType } from '@/schemas/validators/profiling.validators';
import { FormSelectField } from './reusable/FormSelect';
import { FormSliderField } from './reusable/FormSlider';

export default function FinancialForm() {
    const {
        profiling: {
            formData: {
                financial
            }
        },
        updateFinancial,
        updateStage
    } = useProfiling()

    const form = useForm<FinancialInfoType>({
        resolver: zodResolver(financialInfoSchema),
        defaultValues: financial,
        mode: 'onChange'
    });

    const onSubmit = (values: FinancialInfoType) => {
        updateFinancial(values);
        updateStage('investment');
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Emergency Funds */}
                        <FormSelectField
                            name="emergencyFunds"
                            label={<>
                                <Shield className="h-4 w-4" />
                                Emergency Funds
                            </>}
                            options={financialInfoSchema.shape.emergencyFunds.options.map(option => ({
                                value: option,
                                label: option
                            }))}
                            control={form.control}
                            className="w-full"
                        />

                        {/* Dependents */}
                        <FormSelectField
                            name="dependents"
                            label={<>
                                <Users className="h-4 w-4" />
                                Dependents
                            </>}
                            options={financialInfoSchema.shape.dependents.options.map(option => ({
                                value: option,
                                label: option
                            }))}
                            control={form.control}
                            className="w-full"
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