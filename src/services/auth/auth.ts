import { usersTable } from '../../schemas/user.ts';
import { userService } from '../crud/user.ts';
import type { Request, Response } from 'express';
import { db } from '../database.ts';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { logger } from '../log/logger.ts';

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

/**
 * @description  
 * Logs in a user by verifying the username and password  
 * If the user is valid, a JWT token is created and stored in a cookie
 * 
 * @param username 
 * @param password 
 * @param res 
 */
async function login(username: string, password: string, res: Response) {
    const token = await verifyUser(username, password);
    if (token) {
        // Set JWT token in cookies
        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).send({ message: 'User logged in' });
    } else {
        res.status(401).send({ message: 'Invalid credentials' });
    }
}


/**
 * @description
 * Verifies the user by checking if the username exists and the password is valid
 * 
 * @param username 
 * @param password 
 * @returns JWT token if the user is valid, otherwise null
 */
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

/**
 * @description
 * Creates a JWT token with the user payload
 * 
 * @param user 
 * @returns JWT token
 */
function createJwtToken(user: UserPayload) {
    const payload: UserPayload = {
        id: user.id,
        username: user.username,
    };
    const options = { expiresIn: maxAge };

    return jwt.sign(payload, JWT_SECRET, options);
}

/**
 * @description
 * Gets the current user by verifying the JWT token in the cookie  
 * 
 * @param req 
 * @param res 
 * @returns the current user if the user is logged in, otherwise null
 */
async function getCurrentUser(
    req: Request,
    res: Response
): Promise<UserPayload | null> {
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
        logger.error(error);
        return null;
    }
}

/**
 * @description
 * Logs out the user by clearing the JWT token in the cookie
 * 
 * @param {Response} res
 */
function logout(res: Response) {
    // Clear the JWT token from cookies
    res.cookie('jwt', '', { httpOnly: true, maxAge: 1 });
    res.status(200).send({ message: 'User logged out' });
}
