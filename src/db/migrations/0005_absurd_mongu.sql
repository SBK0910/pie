CREATE TYPE "public"."profile_stage" AS ENUM('basic', 'risk');--> statement-breakpoint
ALTER TABLE "user_profiles" ADD COLUMN "profile_stage" "profile_stage" DEFAULT 'basic' NOT NULL;