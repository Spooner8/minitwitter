/**
 * @fileoverview  
 * This file contains the routes for user-related operations.  
 * It includes routes for creating, updating, and deleting users.  
 * 
 * Routes:  
 * - POST /api/user/signup: Creates a new user.  
 * - GET /api/user: Retrieves all users.  
 * - GET /api/user/:id: Retrieves a user by ID.  
 * - PUT /api/user/:id: Updates a user by ID.  
 * - DELETE /api/user/:id: Deletes a user by ID.
 */

import type { Request, Response } from 'express';
import { Router } from 'express';
import { userService } from '../services/crud/user.ts';
import { isOwner } from '../middleware/auth.ts';
import { logger } from '../services/log/logger.ts';

const router = Router();

router.post('/api/user/signup', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await userService.createUser(username, password));
        if (!response) {
            res.status(401).send({ message: 'User not created' });
        } else {
            res.status(201).send({ 'User created': response });
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

router.get('/api/user', async (_req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        if (!users) {
            res.status(404).send({ message: 'Users not found' });
        } else {
            res.status(200).send(users);
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

router.get('/api/user/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = id && (await userService.getUserById(id));
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send(user);
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

router.put('/api/user/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await userService.updateUser(id, username, password));
        if (!response) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ 'User updated': response });
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

router.delete('/api/user/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const response = id && (await userService.deleteUser(id));
        if (!response) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ 'User deleted': response });
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
