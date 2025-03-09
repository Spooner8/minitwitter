/**
 * @fileoverview
 * This file contains the CRUD services for the users table.  
 * The services are used to interact with the database and perform CRUD operations.
 * 
 * It handles the following operations:  
 * 1. createUser - Create a new user in the database.  
 * 2. getUsers - Fetch all users from the database.  
 * 3. getUserById - Fetch a user by its ID from the database.  
 * 4. updateUser - Update a user in the database.  
 * 5. deleteUser - Delete a user from the database.  
 */

import { usersTable } from '../../schemas';
import { db } from '../database.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';

export const userService = {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
};

/**
 * @description
 * Create a new user in the database.
 * 
 * @param {string} username - The username of the user.
 * @param {string} password - The password of the user.
 * 
 * @returns The ID and username of the created user.
 */
async function createUser(username: string, password: string) {
    const salt = await bcrypt.genSalt(10);

    const user: typeof usersTable.$inferInsert = {
        username: username,
        password: await bcrypt.hash(password, salt),
    };

    return await db
        .insert(usersTable)
        .values(user)
        .returning({ id: usersTable.id, username: usersTable.username });
}

/**
 * @description
 * Fetch all users from the database and return the user objects.
 */
async function getUsers() {
    return await db.select({id: usersTable.id, username: usersTable.username}).from(usersTable);
}

/**
 * @description
 * Fetch a user by its ID from the database and return the user object.
 * 
 * @param {number} id - The ID of the user to fetch.
 */
async function getUserById(id: number) {
    return (
        await db
            .select({ id: usersTable.id, username: usersTable.username })
            .from(usersTable)
            .where(eq(usersTable.id, id))
    )[0];
}

/**
 * @description
 * Update a user in the database.
 * 
 * @param {number} id - The ID of the user to update.
 * @param {string} username - The new username for the user.
 * @param {string} password - The new password for the user.
 */
async function updateUser(id: number, username: string, password: string) {
    const salt = await bcrypt.genSalt(10);

    return await db
        .update(usersTable)
        .set({
            username: username,
            password: await bcrypt.hash(password, salt),
        })
        .where(eq(usersTable.id, id));
}

/**
 * @description
 * Delete a user from the database.
 * 
 * @param {number} id - The ID of the user to delete.
 */
async function deleteUser(id: number) {
    return await db.delete(usersTable).where(eq(usersTable.id, id));
}
