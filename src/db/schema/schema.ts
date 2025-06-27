import { pgTable, uuid, integer, pgEnum, timestamp, text, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { investmentObjectiveEnum } from './riskProfile';
import { 
    emergencyFundsEnum, 
    dependentsEnum, 
    jobSecurityEnum, 
    retirementTimelineEnum 
} from './basicProfile';

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