import { db } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq, desc } from "drizzle-orm";
import ClientInfo from "@/components/ClientInfo";
import ProfilingProvider, { ProfilingType } from "@/components/providers/profiling-provider";
import Header from "@/components/Header";
import { userProfiles } from "@/db/schema/userProfile";
import { Toaster } from "sonner";
import { basicProfiles } from "@/db/schema/basicProfile";

export default async function Home() {
    // Initialize with default values
    let defaultProfile: ProfilingType = {
        stage: 'basic_financial_profile',
        formData: {
            profileId: '',
            basicProfile: {
                yearlySavings: 0,
                debt: 0,
                emergencyFunds: 'Less than 3 months',
                dependents: 'Only myself',
                jobSecurity: 'Not secure',
                retirementTimeline: '5 - 15 years',
            },
        },
    };

    try {
        const { userId } = await auth();
        if (!userId) {
            return redirect('/auth');
        }

        let [profile] = await db.select().
            from(userProfiles).
            where(eq(userProfiles.user_id, userId)).
            orderBy(desc(userProfiles.id)).
            limit(1);

        if (!profile) {
            [profile] = await db.insert(userProfiles).values({
                user_id: userId,
                profileStage: 'basic',
            }).returning();
        }

        let [basicProfile] = await db.select().
            from(basicProfiles).
            where(eq(basicProfiles.id, profile.id))

        if (basicProfile) {
            defaultProfile.formData.basicProfile = basicProfile;
        }

        defaultProfile.formData.profileId = profile.id;

    } catch (error) {
        console.error("Error fetching profile:", error);
    }
    return (
        <ProfilingProvider defaultProfiling={defaultProfile}>
            <Header />
            <main className="max-w-3xl mx-auto space-y-8 min-h-screen">
                <ClientInfo />
            </main>
            <Toaster />
        </ProfilingProvider>
    );

}
