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

// Route to handle user signup
router.post('/api/user/signup', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await userService.createUser(username, password));
        if (!response) {
            // If user creation fails, respond with 401 Unauthorized
            res.status(401).send({ message: 'User not created' });
        } else {
            // If user creation succeeds, respond with the user data
            res.status(201).send({ 'User created': response });
        }
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

// Route to get all users
router.get('/api/user', async (_req: Request, res: Response) => {
    try {
        const users = await userService.getUsers();
        if (!users) {
            // If no users are found, respond with 404 Not Found
            res.status(404).send({ message: 'Users not found' });
        } else {
            // If users are found, respond with the users data
            res.status(200).send(users);
        }
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

// Route to get a user by ID
router.get('/api/user/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = id && (await userService.getUserById(id));
        if (!user) {
            // If user is not found, respond with 404 Not Found
            res.status(404).send({ message: 'User not found' });
        } else {
            // If user is found, respond with the user data
            res.status(200).send(user);
        }
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

// Route to update a user
router.put('/api/user/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await userService.updateUser(id, username, password));
        if (!response) {
            // If user is not found, respond with 404 Not Found
            res.status(404).send({ message: 'User not found' });
        } else {
            // If user update succeeds, respond with the updated user data
            res.status(200).send({ 'User updated': response });
        }
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

// Route to delete a user
router.delete('/api/user/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const response = id && (await userService.deleteUser(id));
        if (!response) {
            // If user is not found, respond with 404 Not Found
            res.status(404).send({ message: 'User not found' });
        } else {
            // If user deletion succeeds, respond with the deletion confirmation
            res.status(200).send({ 'User deleted': response });
        }
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

export default router;
