import { pgTable } from 'drizzle-orm/pg-core';
import { timestampSchema } from './timestamp.ts';
import * as t from 'drizzle-orm/pg-core';

export const usersTable = pgTable('users', {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    username: t.varchar('username', { length: 255 }).notNull().unique(),
    password: t.varchar('password', { length: 255 }).notNull(),
    ...timestampSchema,
});
