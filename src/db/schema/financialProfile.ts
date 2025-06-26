import { sql } from 'drizzle-orm';
import { pgTable, uuid, timestamp, integer, pgEnum, check, foreignKey } from 'drizzle-orm/pg-core';
import { userProfiles } from './userProfile';

export const emergencyFundsEnum = pgEnum('emergency_funds',
    ['Less than 3 months', '3 - 6 months',
        '6 months to 1 year', 'More than 1 year']);



export const financialProfiles = pgTable('financial_profiles', {
    id: uuid('id').primaryKey(),
    yearlySavings: integer('yearly_savings').notNull(),
    debt: integer('debt').notNull(),
    emergencyFunds: emergencyFundsEnum('emergency_funds').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    check('yearly_savings_check', sql `${table.yearlySavings} >= 0`),
    check('debt_check', sql `${table.debt} >= 0`),
    foreignKey({
        columns: [table.id],
        foreignColumns: [userProfiles.id],
        name: 'financial_profiles_user_profiles_id_fkey',
    })
]);