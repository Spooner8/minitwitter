import { usersTable } from '../../schemas/user.ts';
import { userService } from '../crud/user.ts';
import type { Request, Response } from 'express';
import { db } from '../database.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../logger.ts';

interface UserPayload {
    id: number;
    username: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: UserPayload;
        }
    }
}

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123';
const maxAge = 1 * 24 * 60 * 60;

export const authService = {
    login,
    logout,
    getCurrentUser,
};

async function login(username: string, password: string, res: Response) {
    const token = await verifyUser(username, password);
    if (token) {
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).send({ message: 'User logged in' });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
}

async function verifyUser(username: string, password: string) {
    const user = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
        .limit(1);

    const isPasswordValid =
        user && (await bcrypt.compare(password, user[0].password));
    return isPasswordValid ? createJwtToken(user[0]) : null;
}

function createJwtToken(user: UserPayload) {
    const payload: UserPayload = {
        id: user.id,
        username: user.username,
    };
    const options = { expiresIn: maxAge };

    return jwt.sign(payload, JWT_SECRET, options);
}

async function getCurrentUser(req: Request, res: Response): Promise<UserPayload | null> {
    try {
        const token = req.cookies?.jwt;
        if (!token) {
            return null;
        }

        const payload = jwt.verify(token, JWT_SECRET) as UserPayload;

        if (payload.id) {
            const user = await userService.getUserById(payload.id);
            return user ? user : null;
        } else {
            return null;
        }
    } catch (error: any) {
        logger.info(error);
        return null;
    }
}

function logout(res: Response) {
    res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
    res.status(200).send({ message: 'User logged out' });
}
