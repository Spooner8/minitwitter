import { timestamp } from 'drizzle-orm/pg-core';

export const timestampSchema = {
    updated_at: timestamp(),
    created_at: timestamp().defaultNow().notNull(),
    deleted_at: timestamp(),
};
