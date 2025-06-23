CREATE TYPE "public"."stage" AS ENUM('static', 'chat');--> statement-breakpoint
ALTER TABLE "profiling" ADD COLUMN "stage" "stage" DEFAULT 'static' NOT NULL;