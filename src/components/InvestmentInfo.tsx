'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentInfoSchema, InvestmentInfoData } from '@/schemas/investment';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Briefcase, Calendar, Target, ArrowLeft } from 'lucide-react';


interface InvestmentInfoProps {
    data: InvestmentInfoData;
    onNext: (data: InvestmentInfoData) => void;
    onPrevious: (data: InvestmentInfoData) => void;
}

export default function InvestmentInfo({ data, onNext, onPrevious }: InvestmentInfoProps) {
    const form = useForm<InvestmentInfoData>({
        resolver: zodResolver(investmentInfoSchema),
        defaultValues: {
            jobSecurity: data?.jobSecurity,
            retirementTimeline: data?.retirementTimeline,
            investmentObjective: data?.investmentObjective,
        },
        mode: 'onChange'
    });

    const handlePrevious = () => {
        onPrevious(form.getValues());
    };

    const onSubmit = (values: InvestmentInfoData) => {
        onNext(values);
    };

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-semibold">Investment Preferences</h2>
                <p className="text-muted-foreground">Tell us about your investment goals and preferences</p>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Job Security */}
                    <FormField
                        control={form.control}
                        name="jobSecurity"
                        render={({ field }) => (
                            <FormItem className="flex flex-col h-full">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Briefcase className="h-4 w-4" />
                                    Job Security
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(investmentInfoSchema.shape.jobSecurity.enum).map((option) => (
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
                            <FormItem className="flex flex-col h-full">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Retirement Timeline
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(investmentInfoSchema.shape.retirementTimeline.enum).map((option) => (
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
                            <FormItem className="flex flex-col h-full col-span-2">
                                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                                    <Target className="h-4 w-4" />
                                    Investment Objective
                                </FormLabel>
                                <div className="w-full">
                                    <Select onValueChange={field.onChange} defaultValue={field.value?.toString()}>
                                        <FormControl>
                                            <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                <SelectValue placeholder="Select an option" className="w-full" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {Object.values(investmentInfoSchema.shape.investmentObjective.enum).map((option) => (
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

                <div className="grid grid-cols-2 gap-4 w-full pt-2">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handlePrevious}
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        <span>Back</span>
                    </Button>
                    <Button 
                        type="submit" 
                        className="w-full flex items-center justify-center gap-2"
                    >
                        <span>Continue</span>
                    </Button>
                </div>
            </form>
        </Form>
        </div>
    );
}