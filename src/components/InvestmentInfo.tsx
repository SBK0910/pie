'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { investmentSchema, InvestmentInfo, retirementTimelineOptions, investmentObjectiveOptions } from '@/schemas/investment';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, ArrowRight, Calendar, Target } from 'lucide-react';

export interface InvestmentInfoProps {
  data: InvestmentInfo;
  onBack: (data: InvestmentInfo) => void;
  onSubmit: (data: InvestmentInfo) => void;
}

export default function InvestmentInfo({ data, onBack, onSubmit }: InvestmentInfoProps) {
  const form = useForm<InvestmentInfo>({
    resolver: zodResolver(investmentSchema),
    defaultValues: data,
  });

  return (
    <div className="w-full max-w-md mx-auto">
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="space-y-6">
            <FormField
              control={form.control}
              name="retirementTimeline"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    Years to Retirement
                  </FormLabel>
                  <Select
                    onValueChange={(value) => field.onChange(Number(value))}
                    defaultValue={field.value?.toString()}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select retirement timeline" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {retirementTimelineOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value.toString()}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="investmentObjective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium flex items-center">
                    <Target className="h-4 w-4 mr-2" />
                    Investment Objective
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select investment objective" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {investmentObjectiveOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

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
              <span>Submit</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}