CREATE TYPE "public"."decision_making" AS ENUM('Emotional', 'Herd following', 'Advice based', 'Analytical', 'Plan driven');--> statement-breakpoint
CREATE TYPE "public"."investment_horizon" AS ENUM('Very short term', 'Short term', 'Medium term', 'Long term');--> statement-breakpoint
CREATE TYPE "public"."market_reaction" AS ENUM('Panic sell', 'Partial sell', 'Hold', 'Buy more');--> statement-breakpoint
CREATE TYPE "public"."market_volatility" AS ENUM('Avoid', 'Reduce', 'Maintain', 'Increase');--> statement-breakpoint
CREATE TYPE "public"."risk_comfort" AS ENUM('Very uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very comfortable');--> statement-breakpoint
CREATE TABLE "financial_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"yearly_savings" integer NOT NULL,
	"debt" integer NOT NULL,
	"emergency_funds" "emergency_funds" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "yearly_savings_check" CHECK ("financial_profiles"."yearly_savings" >= 0),
	CONSTRAINT "debt_check" CHECK ("financial_profiles"."debt" >= 0)
);
--> statement-breakpoint
CREATE TABLE "risk_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"dependents" "dependents" NOT NULL,
	"job_security" "job_security" NOT NULL,
	"retirement_timeline" "retirement_timeline" NOT NULL,
	"investment_objective" "investment_objective" NOT NULL,
	"market_reaction" "market_reaction" NOT NULL,
	"decision_making" "decision_making" NOT NULL,
	"investment_horizon" "investment_horizon" NOT NULL,
	"risk_comfort" "risk_comfort" NOT NULL,
	"market_volatility" "market_volatility" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_profiles" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "financial_profiles" ADD CONSTRAINT "financial_profiles_user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "risk_profiles" ADD CONSTRAINT "risk_profiles_user_profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "public"."user_profiles"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "profiling" DROP COLUMN "id";