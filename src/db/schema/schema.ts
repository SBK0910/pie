import { pgTable, uuid, integer, pgEnum, timestamp, text, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { financialInfoSchema, investmentInfoSchema } from '@/schemas/validators/profiling.validators';

export const emergencyFundsEnum = pgEnum('emergency_funds', financialInfoSchema.shape.emergencyFunds.options);
export const dependentsEnum = pgEnum('dependents', financialInfoSchema.shape.dependents.options);
export const jobSecurityEnum = pgEnum('job_security', investmentInfoSchema.shape.jobSecurity.options);
export const retirementTimelineEnum = pgEnum('retirement_timeline', investmentInfoSchema.shape.retirementTimeline.options);
export const investmentObjectiveEnum = pgEnum('investment_objective', investmentInfoSchema.shape.investmentObjective.options);
export const stageEnum = pgEnum('stage', ['static', 'chat']);


export const profilingSchema = pgTable('profiling', {
    userId: text('user_id').notNull().unique(),
    yearlySavings: integer('yearly_savings').notNull(),
    emergencyFunds: emergencyFundsEnum('emergency_funds').notNull(),
    dependents: dependentsEnum('dependents').notNull(),
    jobSecurity: jobSecurityEnum('job_security').notNull(),
    retirementTimeline: retirementTimelineEnum('retirement_timeline').notNull(),
    investmentObjective: investmentObjectiveEnum('investment_objective').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
    stage: stageEnum('stage').notNull().default('static'),
}, (table) => [
    check('yearly_savings_check', sql`${table.yearlySavings} >= 0`),
]);

export const marketReactionEnum = pgEnum('market_reaction', [
    'panic_sell',          // Sells everything in downturns
    'partial_sell',        // Reduces positions
    'hold',                // Maintains positions
    'buy_more'             // Adds to positions
]);

export const decisionMakingEnum = pgEnum('decision_making', [
    'emotional',           // Based on feelings
    'herd_following',      // Follows crowd/media
    'advice_based',        // Relies on others' advice
    'analytical',          // Research-based
    'plan_driven'          // Follows strict plan
]);

export const investmentHorizonEnum = pgEnum('investment_horizon', [
    'very_short_term',     // < 1 year
    'short_term',          // 1-3 years
    'medium_term',         // 3-5 years
    'long_term'            // 5+ years
]);

export const riskComfortEnum = pgEnum('risk_comfort', [
    'very_uncomfortable',   // Can't tolerate any loss
    'uncomfortable',        // Prefers minimal risk
    'neutral',              // Accepts moderate risk
    'comfortable',          // Takes calculated risks
    'very_comfortable'      // Seeks higher risks
]);

export const marketVolatilityEnum = pgEnum('market_volatility', [
    'avoid',               // Exits volatile markets
    'reduce',              // Reduces exposure
    'maintain',            // Keeps current positions
    'increase'             // Sees as opportunity
]);

export const riskProfileTable = pgTable('risk_profile', {
    userId: text('user_id').notNull().unique(),
    marketReaction: marketReactionEnum('market_reaction').notNull(),
    decisionMaking: decisionMakingEnum('decision_making').notNull(),
    investmentHorizon: investmentHorizonEnum('investment_horizon').notNull(),
    riskComfort: riskComfortEnum('risk_comfort').notNull(),
    marketVolatility: marketVolatilityEnum('market_volatility').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});