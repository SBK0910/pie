'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { Briefcase, Calendar, ArrowRight, Users } from 'lucide-react';
import { useProfiling } from '../providers/profiling-provider';
import { basicRiskProfile, BasicRiskProfileType } from '@/schemas/validators/basicprofile.validator';
import { FormSelectField } from './reusable/FormSelect';
import { api } from '@/lib/api/client';
import { toast } from 'sonner';
import { useState } from 'react';

export default function InvestmentForm() {
    const { updateBasicRisk, updateStage, profiling } = useProfiling();
    const [isSubmitting, setIsSubmitting] = useState(false);


    const form = useForm<BasicRiskProfileType>({
        resolver: zodResolver(basicRiskProfile),
        defaultValues: {
            dependents: profiling.formData.basicProfile.dependents,
            jobSecurity: profiling.formData.basicProfile.jobSecurity,
            retirementTimeline: profiling.formData.basicProfile.retirementTimeline
        },
        mode: 'onChange'
    });

    const onSubmit = async (values: BasicRiskProfileType) => {
        try {
            setIsSubmitting(true);
            // Merge current financial profile with new risk values locally
            const profileData = {
                ...profiling.formData.basicProfile,
                ...values,
            };

            // Persist immediately using merged data (avoids stale context state)
            await api.saveProfile({
                basicProfile: profileData,
                profileId: profiling.formData.profileId,
            });

            // Update local context state afterwards so UI reflects new stage
            updateBasicRisk(values);
            updateStage('chat');
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Failed to save profile';
            toast.error(message);
        } finally {
            setIsSubmitting(false);
        }
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
                            options={[
                                'Not secure', 
                                'Somewhat secure', 
                                'Secure', 
                                'Very secure', 
                                'Job flexibility'
                            ].map(option => ({
                                value: option,
                                label: option
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
                            options={[
                                'Less than 5 years', 
                                '5 - 15 years', 
                                '15 - 25 years', 
                                'More than 25 years'
                            ].map(option => ({
                                value: option,
                                label: option
                            }))}
                            control={form.control}
                            className="w-full"
                        />
                        <FormSelectField
                            name="dependents"
                            label={<>
                                <Users className="h-4 w-4" />
                                Dependents
                            </>}
                            options={[
                                'Only myself', 
                                'Two people including myself', 
                                '3 - 4 people other than myself', 
                                'More than 4 people other than myself'
                            ].map(option => ({
                                value: option,
                                label: option
                            }))}
                            control={form.control}
                            className="w-full col-span-2"
                        />
                    </div>

                    <div className="flex justify-between pt-4  w-full">
                        <Button type="submit" className="gap-2 w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Saving...' : 'Continue'}
                            {isSubmitting && <ArrowRight className="h-4 w-4" />}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}