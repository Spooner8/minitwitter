import type { Request, Response } from 'express';
import { Router } from 'express';
import { postService } from '../services/crud/posts.ts';
import { isUser, isOwner } from '../middleware/auth.ts';
import { authService } from '../services/auth/auth.ts';
import { sentimentQueue } from '../message-broker/index.ts';
import { getPosts, invalidatePostsCache } from '../services/cache/cache.ts';

const router = Router();

router.get('/api/posts', async (_req: Request, res: Response) => {
// router.get('/api/posts', isUser, async (_req: Request, res: Response) => {
    try {
        // const posts = await postService.getPosts();
        const posts = await getPosts();
        if (!posts) {
            res.status(404).send({ message: 'Posts not found' });
        } else {
            res.status(200).send(posts);
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.post('/api/posts', isUser, async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const user = await authService.getCurrentUser(req, res);
        if (!user) {
            res.status(401).send({ message: 'Unauthorized' });
        }

        const response =
            content &&
            user?.id &&
            (await postService.createPost(user.id, content));

        if (!response) {
            res.status(401).send({ message: 'Post not created' });
        } else {
            const postId = response[0].id;
            await sentimentQueue.add('analyzeSentiment', { postId });
            res.status(201).send(response);
        }
        await invalidatePostsCache();
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get(
    '/api/posts/generate',
    isUser,
    async (req: Request, res: Response) => {
        try {
            const response = await postService.generatePost();

            if (!response) {
                res.status(401).send({ message: 'Post not generated' });
            } else {
                res.status(201).send({ content: response });
            }
        } catch (error: any) {
            console.log(error);
            res.status(400).send({ message: error.message });
        }
    }
);

router.put('/api/posts/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { content } = req.body;
        const updates = { content: content };
        const response =
            id && content && (await postService.updatePost(id, updates));
        if (!response) {
            res.status(404).send({ message: 'Post not found' });
        } else {
            const postId = response[0].id;
            await sentimentQueue.add('analyzeSentiment', { postId });
            res.status(200).send({
                message: 'success',
                updated_post: response,
            });
        }
        await invalidatePostsCache();
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete(
    '/api/posts/:id',
    isOwner,
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const response = id && (await postService.deletePost(Number(id)));
            if (!response) {
                res.status(404).send({ message: 'Post not found' });
            } else {
                res.status(200).send({ 'Post deleted': response });
            }
            await invalidatePostsCache();
        } catch (error: any) {
            console.log(error);
            res.status(400).send({ message: error.message });
        }
    }
);

export default router;
