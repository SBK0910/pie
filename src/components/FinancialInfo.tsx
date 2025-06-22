'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { financialInfoSchema } from '@/schemas/financial';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { Slider } from './ui/slider';
import { DollarSign, Shield, Users, ArrowRight } from 'lucide-react';
import type { FinancialInfoData } from '@/schemas/financial';

interface FinancialInfoProps {
    data: FinancialInfoData;
    onNext: (data: FinancialInfoData) => void;
}

export default function FinancialInfo({ data, onNext }: FinancialInfoProps) {
    const form = useForm<FinancialInfoData>({
        resolver: zodResolver(financialInfoSchema),
        defaultValues: data,
        mode: 'onChange'
    });

    const onSubmit = (values: FinancialInfoData) => {
        onNext(values);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Financial Information</h1>
                <p className="text-muted-foreground">Please share your financial details to help us better understand your situation.</p>
            </div>

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
                                        ₹{(field.value || 0).toLocaleString('en-IN')}
                                    </span>
                                </FormLabel>
                                <FormControl>
                                    <div className="space-y-2">
                                        <Slider
                                            min={0}
                                            max={5000000}
                                            step={10000}
                                            value={[field.value || 0]}
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
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                    <SelectValue placeholder="Select an option" className="w-full" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {financialInfoSchema.shape.emergencyFunds.options.map((option) => (
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
                                        <Select 
                                            onValueChange={field.onChange} 
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="h-11 w-full [&>span]:w-full">
                                                    <SelectValue placeholder="Select an option" className="w-full" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {financialInfoSchema.shape.dependents.options.map((option) => (
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