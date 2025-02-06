import type { Request, Response } from 'express';
import { Router } from 'express';
import { postService } from '../services/crud/posts.ts';
import { isUser, isOwner } from '../middleware/auth.ts';
import { authService } from '../services/auth/auth.ts';
import { sentimentQueue } from '../message-broker/index.ts';

const router = Router();

router.get('/api/posts', isUser, async (_req: Request, res: Response) => {
    try {
        const posts = await postService.getPosts();
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

        const response = content && user?.id && (await postService.createPost(user.id, content));

        if (!response) {
            res.status(401).send({ message: 'Post not created' });
        } else {
            const postId = response[0].id;
            await sentimentQueue.add('analyzeSentiment', { postId });
            res.status(201).send(response);
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/api/posts/generate', isUser, async (req: Request, res: Response) => {
    try {
        // const user = await authService.getCurrentUser(req, res);
        const response = await postService.generatePost();
        // const response = user?.id && await postService.generatePost();

        if (!response) {
            res.status(401).send({ message: 'Post not generated' });
        } else {
            res.status(201).send({ 'content': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/api/posts/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { content } = req.body;
        const response = id && content && (await postService.updatePost(id, content));
        if (!response) {
            res.status(404).send({ message: 'Post not found' });
        } else {
            const postId = response[0].id;
            await sentimentQueue.add('analyzeSentiment', { postId });
            res.status(200).send({ message: 'success', updated_post: response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/api/posts/:id', isOwner, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const response = id && (await postService.deletePost(Number(id)));
        if (!response) {
            res.status(404).send({ message: 'Post not found' });
        } else {
            res.status(200).send({ 'Post deleted': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

export default router;
