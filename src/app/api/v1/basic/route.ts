import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { basicProfileApiSchema } from "@/schemas/validators/basicprofile.validator";
import { db } from "@/db";
import { eq, and } from "drizzle-orm";
import { userProfiles } from "@/db/schema/userProfile";
import { basicProfiles } from "@/db/schema/basicProfile";

type ErrorResponse = {
    error: string;
    details?: unknown;
};

export async function PUT(req: NextRequest) {
    try {
        // 1. Authenticate user
        const session = await auth();
        if (!session?.userId) {
            return NextResponse.json(
                { error: "Unauthorized: Please sign in to update financial information" },
                { status: 401 }
            );
        }

        // 2. Validate request body
        const body = await req.json();
        const validation = basicProfileApiSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { 
                    error: "Validation failed", 
                    details: validation.error.format() 
                },
                { status: 400 }
            );
        }

        const { basicProfile, profileId } = validation.data;

        // 3. Verify profile ownership
        const [profile] = await db
            .select({ id: userProfiles.id })
            .from(userProfiles)
            .where(
                and(
                    eq(userProfiles.id, profileId),
                    eq(userProfiles.user_id, session.userId)
                )
            )
            .limit(1);

        if (!profile) {
            return NextResponse.json(
                { error: "Profile not found or access denied" },
                { status: 404 }
            );
        }

        // 5. Upsert financial profile
        const [savedProfile] = await db
            .insert(basicProfiles)
            .values({
                id: profile.id,
                ...basicProfile,
            })
            .onConflictDoUpdate({
                target: basicProfiles.id,
                set: {
                    ...basicProfile,
                    updatedAt: new Date(),
                }
            })
            .returning();

        // 6. Return success response
        return NextResponse.json({
            success: true,
            data: {
                profileId: profile.id,
                savedProfile,
            }
        });

    } catch (error) {
        console.error("Error in financial profile update:", error);
        const errorResponse: ErrorResponse = { 
            error: "An unexpected error occurred"
        };
        
        if (error instanceof Error) {
            errorResponse.details = process.env.NODE_ENV === 'development' ? error.message : undefined;
        }
        
        return NextResponse.json(
            errorResponse,
            { status: 500 }
        );
    }
}