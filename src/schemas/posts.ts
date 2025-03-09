import { pgTable } from 'drizzle-orm/pg-core';
import { timestampSchema } from './timestamp.ts';
import * as t from 'drizzle-orm/pg-core';
import { usersTable } from './user.ts';

export const postsTable = pgTable('posts', {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    content: t.varchar('content', { length: 255 }).notNull(),
    sentiment: t.varchar('sentiment', { length: 255 }).notNull().default(''),
    correction: t.varchar('correction', { length: 255 }).notNull().default(''),
    userId: t
        .integer('user_id')
        .notNull()
        .references(() => usersTable.id, { onDelete: 'cascade' }),
    ...timestampSchema,
});
