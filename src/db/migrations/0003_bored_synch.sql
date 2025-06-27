ALTER TABLE "risk_profiles" ALTER COLUMN "dependents" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "job_security" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "retirement_timeline" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "investment_objective" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "market_reaction" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "decision_making" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "investment_horizon" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "risk_comfort" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "risk_profiles" ALTER COLUMN "market_volatility" DROP NOT NULL;