import { pgSchema } from 'drizzle-orm/pg-core';
import { timestampSchema } from './timestamp.ts';
import * as t from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';

export const userSchema = pgSchema('users');

export const usersTable = userSchema.table('users', {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    username: t.varchar('username', { length: 255 }).notNull().unique(),
    password: t.varchar('password', { length: 255 }).notNull(),
    ...timestampSchema,
});

export type User = InferSelectModel<typeof usersTable>;