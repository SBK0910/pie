import { sql } from 'drizzle-orm';
import { pgTable, uuid, timestamp, integer, pgEnum, check, foreignKey } from 'drizzle-orm/pg-core';
import { userProfiles } from './userProfile';

export const emergencyFundsEnum = pgEnum('emergency_funds',
    ['Less than 3 months', '3 - 6 months',
        '6 months to 1 year', 'More than 1 year']);

export const dependentsEnum = pgEnum('dependents',
    ['Only myself', 'Two people including myself',
        '3 - 4 people other than myself', 'More than 4 people other than myself']);

export const jobSecurityEnum = pgEnum('job_security',
    ['Not secure', 'Somewhat secure',
        'Secure', 'Very secure', 'Job flexibility']);

export const retirementTimelineEnum = pgEnum('retirement_timeline',
    ['Less than 5 years', '5 - 15 years',
        '15 - 25 years', 'More than 25 years']);

export const basicProfiles = pgTable('basic_profiles', {
    id: uuid('id').primaryKey(),

    yearlySavings: integer('yearly_savings').notNull(),
    debt: integer('debt').notNull(),
    emergencyFunds: emergencyFundsEnum('emergency_funds').notNull(),

    dependents: dependentsEnum('dependents').notNull(),
    jobSecurity: jobSecurityEnum('job_security').notNull(),
    retirementTimeline: retirementTimelineEnum('retirement_timeline').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    check('yearly_savings_check', sql`${table.yearlySavings} >= 0`),
    check('debt_check', sql`${table.debt} >= 0`),
    foreignKey({
        columns: [table.id],
        foreignColumns: [userProfiles.id],
        name: 'financial_profiles_user_profiles_id_fkey',
    })
]);