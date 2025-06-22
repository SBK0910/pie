import { db } from "@/db";
import { profilingSchema } from "@/schemas/schema";
import { profilingSchema as profilingTable } from "@/db/schema/schema";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { NeonDbError } from "@neondatabase/serverless";

export async function POST(req: NextRequest) {
    try {
        // Parse and validate request body
        const body = await req.json();
        const result = profilingSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: "Invalid request data", details: result.error.errors },
                { status: 400 }
            );
        }

        // Authenticate user
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Insert new profile - will fail with unique constraint violation if profile exists
        const { financial, investment } = result.data;
        const [newProfile] = await db
            .insert(profilingTable)
            .values({
                userId,
                dependents: financial.dependents,
                jobSecurity: investment.jobSecurity,
                retirementTimeline: investment.retirementTimeline,
                investmentObjective: investment.investmentObjective,
                yearlySavings: financial.yearlySavings,
                emergencyFunds: financial.emergencyFunds,
            })
            .returning();

        return NextResponse.json(
            {
                message: "Profile created successfully",
                data: newProfile
            },
            { status: 201 }
        );

    } catch (error) {
        console.error("Error in profile creation:", error);

        // Handle unique constraint violation
        if (error && error instanceof Error && error.cause instanceof NeonDbError) {
            if (
                error.cause.code === '23505' &&
                error.cause.constraint === 'profiling_user_id_unique'
            ) {
                return NextResponse.json(
                    {
                        error: 'A profile already exists for this user',
                        code: 'DUPLICATE_PROFILE',
                    },
                    { status: 409 }
                );
            }
        }

        // Default error response for unhandled errors
        const errorResponse: {
            error: string;
            code: string;
            details?: string;
        } = {
            error: 'Internal server error',
            code: 'INTERNAL_SERVER_ERROR'
        };

        // Only include error message in development
        if (process.env.NODE_ENV === 'development') {
            errorResponse.details = error instanceof Error ? error.message : String(error);
        }

        return NextResponse.json(errorResponse, { status: 500 });
    }
}

// Optional: Add GET endpoint to fetch user's profile
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const [profile] = await db
            .select()
            .from(profilingTable)
            .where(eq(profilingTable.userId, userId))
            .limit(1);

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({ data: profile });

    } catch (error) {
        console.error("Error fetching profile:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}