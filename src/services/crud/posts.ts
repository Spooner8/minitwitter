/**
 * @fileoverview
 * This file contains the CRUD services for the posts table.  
 * The services are used to interact with the database and perform CRUD operations.  
 * 
 * It handles the following operations:  
 * 1. getPosts - Fetch all posts from the database.  
 * 2. getPostById - Fetch a post by its ID from the database.  
 * 3. createPost - Create a new post in the database.  
 * 4. generatePost - Generate a random post using the AI model.  
 * 5. updatePost - Update a post in the database.  
 * 6. deletePost - Delete a post from the database.
 */

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

/**
 * @description
 * Fetch all posts from the database and return the post objects.
 */
async function getPosts() {
    return await db.select().from(postsTable);
}

/**
 * @description
 * Fetch a post by its ID from the database and return the post object.
 * 
 * @param {number} id - The ID of the post.
 */
async function getPostById(id: number) {
    return (await db.select().from(postsTable).where(eq(postsTable.id, id)))[0];
}

/**
 * @description
 * Create a new post in the database.
 * 
 * @param {number} userId - The ID of the user who created the post.
 * @param {string} content - The content of the post.
 * 
 * @returns The ID of the created post.
 */
async function createPost(userId: number, content: string) {
    const post: typeof postsTable.$inferInsert = {
        userId: userId,
        content: content,
    };
 
    return await db.insert(postsTable).values(post).returning();
}

/**
 * @description
 * Generate a random post using the AI model.
 * 
 * @returns The generated post content.
 */
async function generatePost() {
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
 
    return content.message.content;
}

/**
 * @description
 * Update a post in the database.
 * 
 * @param {number} id - The ID of the post to update.
 * @param {Partial<typeof postsTable.$inferInsert>} updates - The updates to apply to the post.
 * 
 * @returns The updated post object.
 */
async function updatePost(id: number, updates: Partial<typeof postsTable.$inferInsert>) {
    return await db
        .update(postsTable)
        .set({
            ...updates,
            updated_at: new Date(),
        })
        .where(eq(postsTable.id, id))
        .returning();
}

/**
 * @description
 * Delete a post from the database.
 * 
 * @param {number} id - The ID of the post to delete.
 * 
 * @returns The deleted post object.
 */
async function deletePost(id: number) {
    return await db.update(postsTable).set({ deleted_at: new Date() }).where(eq(postsTable.id, id)).returning();
}