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
        const user = await authService.getCurrentUser(req);
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            next();
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
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
        const user = await authService.getCurrentUser(req);
        const postId = parseInt(req.params.id);

        const post = await postService.getPostById(postId);
        if (!user || !post || user.id !== post.userId) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            next();
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(400).json({ message: error.message });
        } else {
            res.status(400).json({ message: 'An unknown error occurred' });
        }
    }
};
