import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';


export const userProfiles = pgTable('user_profiles', {
    id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
    user_id: text('user_id').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
});