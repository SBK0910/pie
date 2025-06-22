CREATE TYPE "public"."dependents" AS ENUM('Only myself', 'Two people including myself', '3 - 4 people other than myself', 'More than 4 people other than myself');--> statement-breakpoint
CREATE TYPE "public"."emergency_funds" AS ENUM('Less than 3 months', '3 - 6 months', '6 months to 1 year', 'More than 1 year');--> statement-breakpoint
CREATE TYPE "public"."investment_objective" AS ENUM('Preserve', 'Income', 'Growth', 'Aggressive');--> statement-breakpoint
CREATE TYPE "public"."job_security" AS ENUM('Not secure', 'Somewhat secure', 'Secure', 'Very secure', 'Job flexibility');--> statement-breakpoint
CREATE TYPE "public"."retirement_timeline" AS ENUM('Less than 5 years', '5 - 15 years', '15 - 25 years', 'More than 25 years');--> statement-breakpoint
CREATE TABLE "profiling" (
	"user_id" text NOT NULL,
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"yearly_savings" integer NOT NULL,
	"emergency_funds" "emergency_funds" NOT NULL,
	"dependents" "dependents" NOT NULL,
	"job_security" "job_security" NOT NULL,
	"retirement_timeline" "retirement_timeline" NOT NULL,
	"investment_objective" "investment_objective" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "profiling_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "yearly_savings_check" CHECK ("profiling"."yearly_savings" >= 0)
);
