import { pgTable, uuid, integer, pgEnum, timestamp, text, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { financialInfoSchema } from '@/schemas/financial';
import { investmentInfoSchema } from '@/schemas/investment';

export const emergencyFundsEnum = pgEnum('emergency_funds', financialInfoSchema.shape.emergencyFunds.options);
export const dependentsEnum = pgEnum('dependents', financialInfoSchema.shape.dependents.options);
export const jobSecurityEnum = pgEnum('job_security', investmentInfoSchema.shape.jobSecurity.options);
export const retirementTimelineEnum = pgEnum('retirement_timeline', investmentInfoSchema.shape.retirementTimeline.options);
export const investmentObjectiveEnum = pgEnum('investment_objective', investmentInfoSchema.shape.investmentObjective.options);
export const stageEnum = pgEnum('stage', ['static', 'chat']);


export const profilingSchema = pgTable('profiling', {
    userId: text('user_id').notNull().unique(),
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
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