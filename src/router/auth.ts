/**
 * @fileoverview  
 * This file contains the routes for authentication-related operations.  
 * It includes routes for login, logout, and checking login status.  
 * 
 * Routes:  
 * - POST /api/auth/login: Authenticates a user with username and password.  
 * - GET /api/auth/logout: Logs out the current user.  
 * - GET /api/auth/loginstatus: Checks if the user is currently logged in.
 */

import type { Request, Response } from 'express';
import { Router } from 'express';
import { authService } from '../services/auth/auth.ts';
import { logger } from '../services/log/logger.ts';

const router = Router();

router.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await authService.login(username, password, res));
        if (!response) {
            res.status(401).send({ message: 'User not found' });
        } else {
            res.status(200).send(response);
        }
    } catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.get('/api/auth/logout', (_req: Request, res: Response) => {
    try {
        authService.logout(res);
    } catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

router.get('/api/auth/loginstatus', async (req: Request, res: Response) => {
    try {
        const user = await authService.getCurrentUser(req);
    if (user) {
        res.status(200).json({ isLoggedIn: true, user });
    } else {
        res.status(200).json({ isLoggedIn: false });
    }
    } catch (error: unknown) {
        logger.error(error);
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
});

export default router;
