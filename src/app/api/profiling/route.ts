import { db } from "@/db";
import { profilingSchema } from "@/schemas/schema";
import { profilingSchema as profilingTable } from "@/db/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const body = await req.json();
        const result = profilingSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: result.error.errors },
                { status: 400 }
            );
        }

        const { financial, investment } = result.data;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const [profile] = await db.insert(profilingTable)
            .values({
                userId,
                dependents: financial.dependents,
                jobSecurity: investment.jobSecurity,
                retirementTimeline: investment.retirementTimeline,
                investmentObjective: investment.investmentObjective,
                yearlySavings: financial.yearlySavings,
                emergencyFunds: financial.emergencyFunds,
                stage: 'chat'
            })
            .onConflictDoUpdate({
                target: profilingTable.userId,
                set: {
                    dependents: financial.dependents,
                    jobSecurity: investment.jobSecurity,
                    retirementTimeline: investment.retirementTimeline,
                    investmentObjective: investment.investmentObjective,
                    yearlySavings: financial.yearlySavings,
                    emergencyFunds: financial.emergencyFunds,
                    stage: 'chat'
                }
            }).returning();

        return NextResponse.json({ data: profile });
    } catch (error) {
        console.error("Error updating profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}