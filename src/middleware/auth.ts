import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth/auth.ts';
import { postService } from '../services/crud/posts.ts';

/**
 * @description Middleware to check if user is authenticated
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next 
 */
export const isUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get the current user from the authService
        const user = await authService.getCurrentUser(req, res);
        if (!user) {
            // If no user is found, respond with 401 Unauthorized
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            // If user is found, proceed to the next middleware
            next();
        }
    } catch (error: any) {
        // Handle any errors and respond with 400 Bad Request
        res.status(400).json({ message: error.message });
    }
};

/**
 * @description Middleware to check if user is the owner of a post
 * 
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export const isOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get the current user from the authService
        const user = await authService.getCurrentUser(req, res);
        // Get the post ID from the request parameters
        const postId = parseInt(req.params.id);

        // Get the post by ID from the postService
        const post = await postService.getPostById(postId);
        if (!user || !post || user.id !== post.userId) {
            // If no user, no post, or user is not the owner, respond with 401 Unauthorized
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            // If user is the owner, proceed to the next middleware
            next();
        }
    } catch (error: any) {
        // Handle any errors and respond with 400 Bad Request
        res.status(400).json({ message: error.message });
    }
};
