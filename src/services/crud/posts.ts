import ollama from 'ollama';
import { postsTable } from '../../schemas/posts.ts';
import { db } from '../database.ts';
import { eq } from 'drizzle-orm';

export const postService = {
    getPosts,
    createPost,
    generatePost,
    updatePost,
    deletePost,
};

async function getPosts() {
    return await db.select().from(postsTable);
}

async function createPost(content: string) {
    const post: typeof postsTable.$inferInsert = {
        content: content,
    };

    return await db.insert(postsTable).values(post).returning();
}

async function generatePost() {
    const content = await ollama.chat({
        model: 'llama3.2:1b',
        messages: [
            {
                role: 'user',
                content:
                    'Create a short random twitter-post with maximum 140 characters.',
            },
        ],
    });

    const post: typeof postsTable.$inferInsert = {
        content: content.message.content,
    };

    return await db.insert(postsTable).values(post).returning();
}

async function updatePost(id: number, content: string) {
    return await db
        .update(postsTable)
        .set({
            content: content,
        })
        .where(eq(postsTable.id, id));
}

async function deletePost(id: number) {
    return await db.delete(postsTable).where(eq(postsTable.id, id));
}
