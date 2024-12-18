import type { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth/auth.ts';
import { postService } from '../services/crud/posts.ts';

export const isUser = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await authService.getCurrentUser(req, res);
        if (!user) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            next();
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const isOwner = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await authService.getCurrentUser(req, res);
        const postId = parseInt(req.params.id);

        const post = await postService.getPostById(postId);
        if (!user || !post || user.id !== post.userId) {
            res.status(401).json({ message: 'Unauthorized' });
        } else {
            next();
        }
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
