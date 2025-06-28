ALTER TABLE "profiling" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "profiling" CASCADE;--> statement-breakpoint
ALTER TABLE "basic_profiles" DROP CONSTRAINT "financial_profiles_user_profiles_id_fkey";
--> statement-breakpoint
ALTER TABLE "risk_profiles" DROP CONSTRAINT "risk_profiles_user_profiles_id_fkey";
--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD CONSTRAINT "basic_profiles_id_user_profiles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_profiles" ADD CONSTRAINT "risk_profiles_id_user_profiles_id_fk" FOREIGN KEY ("id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."stage";