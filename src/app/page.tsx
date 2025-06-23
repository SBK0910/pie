import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profilingSchema as profilingTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import ClientInfo from "@/components/ClientInfo";
import type { FinancialInfoData } from '@/schemas/financial';
import type { InvestmentInfoData } from '@/schemas/investment';

export default async function Home() {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/auth');
    }
    
    let defaultStep: 'financial' | 'investment' | 'chat' = 'financial';
    let defaultValues: {
        financial: FinancialInfoData;
        investment: InvestmentInfoData;
    } = {
        financial: {
            yearlySavings: 0,
            emergencyFunds: 'Less than 3 months',
            dependents: 'Only myself',
        },
        investment: {
            jobSecurity: 'Not secure',
            retirementTimeline: '5 - 15 years',
            investmentObjective: 'Growth',
        },
    };

    try {
        const [profile] = await db.select().from(profilingTable).where(eq(profilingTable.userId, userId)).limit(1);
        if (profile) {
            defaultStep = profile.stage === 'static' ? 'financial' : 'chat';
            defaultValues = {
                financial: {
                    yearlySavings: profile.yearlySavings,
                    emergencyFunds: profile.emergencyFunds,
                    dependents: profile.dependents,
                },
                investment: {
                    jobSecurity: profile.jobSecurity,
                    retirementTimeline: profile.retirementTimeline,
                    investmentObjective: profile.investmentObjective,
                },
            };
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }

    return (
        <ClientInfo defaultStep={defaultStep} defaultValues={defaultValues} />
    );
    
}
