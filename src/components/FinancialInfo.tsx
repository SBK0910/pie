'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { financialInfoSchema, FinancialInfo} from '@/schemas/financial';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { ArrowLeft, ArrowRight, DollarSign, Shield, Users, Briefcase, Calendar, Target } from 'lucide-react';

export type FinancialInfoData = z.infer<typeof financialInfoSchema>;

interface FinancialInfoProps {
    data: FinancialInfoData;
    onBack: (data: FinancialInfoData) => void;
    onNext: (data: FinancialInfoData) => void;
}

export default function FinancialInfo({
    data,
    onBack,
    onNext
}: FinancialInfoProps) {
    const form = useForm<FinancialInfoData>({
        resolver: zodResolver(financialInfoSchema),
        defaultValues: {
            yearlySavings: data?.yearlySavings,
            emergencyFunds: data?.emergencyFunds,
            dependents: data?.dependents,
            jobSecurity: data?.jobSecurity,
            investmentObjective: data?.investmentObjective,
            retirementTimeline: data?.retirementTimeline,
        },
        mode: 'onChange'
    });

    const onSubmit = (values: FinancialInfoData) => {
        onNext(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Yearly Savings */}
                <FormField
                    control={form.control}
                    name="yearlySavings"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <DollarSign className="h-4 w-4" />
                                Yearly Savings (₹)
                                <span className="ml-auto font-normal text-muted-foreground">
                                    ₹{field.value.toLocaleString('en-IN')}
                                </span>
                            </FormLabel>
                            <FormControl>
                                <div className="space-y-2">
                                    <Slider
                                        min={0}
                                        max={5000000}
                                        step={10000}
                                        value={[field.value]}
                                        onValueChange={(value) => field.onChange(Number(value[0]))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs text-muted-foreground">
                                        <span>₹0</span>
                                        <span>₹50L+</span>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Emergency Funds */}
                    <FormField
                        control={form.control}
                        name="emergencyFunds"
                        render={({ field }) => (
                            <FormItem className="flex flex-col h-full">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Shield className="h-4 w-4" />
                                    Emergency Funds
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(financialInfoSchema.shape.emergencyFunds.enum).map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Dependents */}
                    <FormField
                        control={form.control}
                        name="dependents"
                        render={({ field }) => (
                            <FormItem className="flex flex-col h-full">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Users className="h-4 w-4" />
                                    Dependents
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(financialInfoSchema.shape.dependents.enum).map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                     {/* Retirement Timeline */}
                     <FormField
                        control={form.control}
                        name="retirementTimeline"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Retirement Timeline
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(financialInfoSchema.shape.retirementTimeline.enum).map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />

                    {/* Investment Objective */}
                    <FormField
                        control={form.control}
                        name="investmentObjective"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Target className="h-4 w-4" />
                                    Investment Objective
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(financialInfoSchema.shape.investmentObjective.enum).map((option) => (
                                                <SelectItem key={option} value={option}>
                                                    {option}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <FormMessage className="text-xs" />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Job Security */}
                <FormField
                    control={form.control}
                    name="jobSecurity"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                <Briefcase className="h-4 w-4" />
                                Job Security
                            </FormLabel>
                            <div className="w-full">
                                <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value?.toString()}>
                                    <FormControl>
                                        <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                            <SelectValue placeholder="Select an option" className="w-full" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values(financialInfoSchema.shape.jobSecurity.enum).map((option) => (
                                            <SelectItem key={option} value={option}>
                                                {option}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormMessage className="text-xs" />
                        </FormItem>
                    )}
                />

                {/* Navigation Buttons */}
                <div className="grid grid-cols-2 gap-4 pt-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onBack(form.getValues())}
                        className="h-10 w-full text-sm font-medium flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
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
    )
}