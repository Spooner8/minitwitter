import ollama from 'ollama';
import { postsTable } from '../../schemas';
import { db } from '../database.ts';
import { eq } from 'drizzle-orm';
import 'dotenv/config';

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

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
    // const content = await ollama.chat({
    //     model: 'llama3.2:1b',
    //     messages: [
    //         {
    //             role: 'user',
    //             content:
    //                 'Create a short random twitter-post with maximum 140 characters.',
    //         },
    //     ],
    // });

    console.log('fetching content for ollama');
    const content = await fetch(`${OLLAMA_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: 'llama3.2:1b',
            messages: [
                {
                    role: 'user',
                    content:
                        'Create a short random twitter-post with maximum 140 characters.',
                },
            ],
        }),
    }).then((res) => console.log(res));
    return true;
    // const post: typeof postsTable.$inferInsert = {
    //     userId: userId,
    //     content: content.message.content,
    // };

    // return await db.insert(postsTable).values(post).returning();
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
