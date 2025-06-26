import { pgTable, uuid, timestamp, foreignKey, pgEnum } from 'drizzle-orm/pg-core';
import { userProfiles } from './userProfile';

export const dependentsEnum = pgEnum('dependents',
    ['Only myself', 'Two people including myself',
        '3 - 4 people other than myself', 'More than 4 people other than myself']);

export const jobSecurityEnum = pgEnum('job_security',
    ['Not secure', 'Somewhat secure',
        'Secure', 'Very secure', 'Job flexibility']);

export const retirementTimelineEnum = pgEnum('retirement_timeline',
    ['Less than 5 years', '5 - 15 years',
        '15 - 25 years', 'More than 25 years']);

export const investmentObjectiveEnum = pgEnum('investment_objective',
    ['Preserve', 'Income', 'Growth', 'Aggressive']);

export const marketReactionEnum = pgEnum('market_reaction',
    ['Panic sell', 'Partial sell', 'Hold', 'Buy more']);

export const decisionMakingEnum = pgEnum('decision_making',
    ['Emotional', 'Herd following', 'Advice based', 'Analytical', 'Plan driven']);

export const investmentHorizonEnum = pgEnum('investment_horizon',
    ['Very short term', 'Short term', 'Medium term', 'Long term']);

export const riskComfortEnum = pgEnum('risk_comfort',
    ['Very uncomfortable', 'Uncomfortable', 'Neutral', 'Comfortable', 'Very comfortable']);

export const marketVolatilityEnum = pgEnum('market_volatility',
    ['Avoid', 'Reduce', 'Maintain', 'Increase']);



export const riskProfiles = pgTable('risk_profiles', {
    id: uuid('id').primaryKey(),

    dependents: dependentsEnum('dependents').notNull(),
    jobSecurity: jobSecurityEnum('job_security').notNull(),
    retirementTimeline: retirementTimelineEnum('retirement_timeline').notNull(),
    investmentObjective: investmentObjectiveEnum('investment_objective').notNull(),

    marketReaction: marketReactionEnum('market_reaction').notNull(),
    decisionMaking: decisionMakingEnum('decision_making').notNull(),
    investmentHorizon: investmentHorizonEnum('investment_horizon').notNull(),
    riskComfort: riskComfortEnum('risk_comfort').notNull(),
    marketVolatility: marketVolatilityEnum('market_volatility').notNull(),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
}, (table) => [
    foreignKey({
        columns: [table.id],
        foreignColumns: [userProfiles.id],
        name: 'risk_profiles_user_profiles_id_fkey',
    })
]);