'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentInfoSchema } from '@/schemas/validators/profiling.validators';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { Briefcase, Calendar, Target, ArrowRight } from 'lucide-react';
import { useProfiling } from '../providers/profiling-provider';
import { InvestmentInfoType } from '@/schemas/validators/profiling.validators';
import { FormSelectField } from './reusable/FormSelect';

export default function InvestmentForm() {
    const { updateInvestment, updateStage, profiling } = useProfiling();

    const form = useForm<InvestmentInfoType>({
        resolver: zodResolver(investmentInfoSchema),
        defaultValues: profiling.formData.investment,
        mode: 'onChange'
    });

    const onSubmit = (values: InvestmentInfoType) => {
        updateInvestment(values);
        updateStage('chat');
    };

    return (
        <div className="w-full space-y-12">
            <div>
                <h2 className="text-2xl font-semibold">Investment Preferences</h2>
                <p className="text-muted-foreground">Tell us about your investment goals and preferences</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Job Security */}
                        <FormSelectField
                            name="jobSecurity"
                            label={<>
                                <Briefcase className="h-4 w-4" />
                                Job Security
                            </>}
                            options={Object.entries(investmentInfoSchema.shape.jobSecurity.enum).map(([key, value]) => ({
                                value: value as string,
                                label: value as string
                            }))}
                            control={form.control}
                            className="w-full"
                        />

                        {/* Retirement Timeline */}
                        <FormSelectField
                            name="retirementTimeline"
                            label={<>
                                <Calendar className="h-4 w-4" />
                                Retirement Timeline
                            </>}
                            options={Object.entries(investmentInfoSchema.shape.retirementTimeline.enum).map(([key, value]) => ({
                                value: value as string,
                                label: value as string
                            }))}
                            control={form.control}
                            className="w-full"
                        />

                        {/* Investment Objective */}
                        <FormSelectField
                            name="investmentObjective"
                            label={<>
                                <Target className="h-4 w-4" />
                                Investment Objective
                            </>}
                            options={Object.entries(investmentInfoSchema.shape.investmentObjective.enum).map(([key, value]) => ({
                                value: value as string,
                                label: value as string
                            }))}
                            control={form.control}
                            className="w-full col-span-2"
                        />
                    </div>

                    <div className="flex justify-between pt-4  w-full">
                        <Button type="submit" className="gap-2 w-full">
                            Continue
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}