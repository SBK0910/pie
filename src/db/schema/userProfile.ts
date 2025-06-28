import { pgTable, uuid, text, timestamp, pgEnum } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profileStageEnum = pgEnum('profile_stage', ['basic', 'risk']);

export const userProfiles = pgTable('user_profiles', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    user_id: text('user_id').notNull(),
    profileStage: profileStageEnum('profile_stage').notNull().default('basic'),
    created_at: timestamp('created_at').notNull().defaultNow(),
});