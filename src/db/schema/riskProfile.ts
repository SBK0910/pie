import { pgTable, uuid, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { userProfiles } from './userProfile';

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
    id: uuid('id').primaryKey().references(() => userProfiles.id),

    investmentObjective: investmentObjectiveEnum('investment_objective'),
    marketReaction: marketReactionEnum('market_reaction'),
    decisionMaking: decisionMakingEnum('decision_making'),
    investmentHorizon: investmentHorizonEnum('investment_horizon'),
    riskComfort: riskComfortEnum('risk_comfort'),
    marketVolatility: marketVolatilityEnum('market_volatility'),

    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
});