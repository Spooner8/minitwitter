import { pgSchema } from 'drizzle-orm/pg-core';
import { timestampSchema } from './timestamp.ts';
import * as t from 'drizzle-orm/pg-core';
import type { InferSelectModel } from 'drizzle-orm';
import { usersTable } from './user.ts';

export const postsSchema = pgSchema('posts');

export const postsTable = postsSchema.table('posts', {
    id: t.integer().primaryKey().generatedAlwaysAsIdentity(),
    content: t.varchar('content', { length: 255 }).notNull(),
    userId: t.integer('user_id').notNull().references(() => usersTable.id, { onDelete: 'cascade' }),
    ...timestampSchema,
});

export type Post = InferSelectModel<typeof postsTable>;
