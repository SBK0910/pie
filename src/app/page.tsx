import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { profilingSchema as profilingTable } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import ClientInfo from "@/components/ClientInfo";
import type { FinancialInfoType,InvestmentInfoType } from '@/schemas/validators/profiling.validators';
import ProfilingProvider from "@/components/providers/profiling-provider";
import Header from "@/components/Header";

export default async function Home() {
    const { userId } = await auth();
    if (!userId) {
        return redirect('/auth');
    }
    
    let defaultStep: 'financial' | 'investment' | 'chat' = 'financial';
    let defaultValues: {
        financial: FinancialInfoType;
        investment: InvestmentInfoType;
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
        <ProfilingProvider defaultProfiling={{ stage: 'financial', formData: defaultValues }}>
            <Header />
            <main className="max-w-3xl mx-auto space-y-8 min-h-screen">
                <ClientInfo />
            </main>
        </ProfilingProvider>
    );
    
}
