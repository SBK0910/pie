ALTER TABLE "financial_profiles" RENAME TO "basic_profiles";--> statement-breakpoint
ALTER TABLE "basic_profiles" DROP CONSTRAINT "yearly_savings_check";--> statement-breakpoint
ALTER TABLE "basic_profiles" DROP CONSTRAINT "debt_check";--> statement-breakpoint
ALTER TABLE "basic_profiles" DROP CONSTRAINT "financial_profiles_user_profiles_id_fkey";
--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD COLUMN "dependents" "dependents" NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD COLUMN "job_security" "job_security" NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD COLUMN "retirement_timeline" "retirement_timeline" NOT NULL;--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD CONSTRAINT "financial_profiles_user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_profiles" DROP COLUMN "dependents";--> statement-breakpoint
ALTER TABLE "risk_profiles" DROP COLUMN "job_security";--> statement-breakpoint
ALTER TABLE "risk_profiles" DROP COLUMN "retirement_timeline";--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD CONSTRAINT "yearly_savings_check" CHECK ("basic_profiles"."yearly_savings" >= 0);--> statement-breakpoint
ALTER TABLE "basic_profiles" ADD CONSTRAINT "debt_check" CHECK ("basic_profiles"."debt" >= 0);