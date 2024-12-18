import { usersTable } from '../../schemas/user.ts';
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

async function createUser(username: string, password: string) {
    const salt = await bcrypt.genSalt(10);

    const user: typeof usersTable.$inferInsert = {
        username: username,
        password: await bcrypt.hash(password, salt),
    };

    return await db.insert(usersTable).values(user).returning();
}

async function getUsers() {
    return await db.select().from(usersTable);
}

async function getUserById(id: number) {
    return (await db.select().from(usersTable).where(eq(usersTable.id, id)))[0];
}

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

async function deleteUser(id: number) {
    return await db.delete(usersTable).where(eq(usersTable.id, id));
}