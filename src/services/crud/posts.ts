import { postsTable } from '../../schemas';
import { db } from '../database.ts';
import { eq } from 'drizzle-orm';
import { ollama, OLLAMA_MODEL } from '../ai/ai.ts';

export const postService = {
    getPosts,
    getPostById,
    createPost,
    generatePost,
    updatePost,
    deletePost,
};

async function getPosts() {
    return await db.select().from(postsTable);
}

async function getPostById(id: number) {
    return (await db.select().from(postsTable).where(eq(postsTable.id, id)))[0];
}

async function createPost(userId: number, content: string) {
    const post: typeof postsTable.$inferInsert = {
        userId: userId,
        content: content,
    };

    return await db.insert(postsTable).values(post).returning();
}

async function generatePost(userId: number) {
    const content = await ollama.chat({
        model: OLLAMA_MODEL,
        messages: [
            {
                role: 'user',
                content:
                    'Create a short random twitter-post with maximum 140 characters.',
            },
        ],
    });
    const post: typeof postsTable.$inferInsert = {
        userId: userId,
        content: content.message.content,
    };

    return await db.insert(postsTable).values(post).returning();
}

async function updatePost(id: number, content: string) {
    return await db
        .update(postsTable)
        .set({
            content: content,
            updated_at: new Date(),
        })
        .where(eq(postsTable.id, id))
        .returning();
}

async function deletePost(id: number) {
    return await db.update(postsTable).set({ deleted_at: new Date() }).where(eq(postsTable.id, id)).returning();
}
