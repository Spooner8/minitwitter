import type { Request, Response } from 'express';
import { Router } from 'express';
import { postService } from '../services/crud/posts.ts';

const router = Router();

router.get('/api/posts', async (_req: Request, res: Response) => {
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

router.post('/api/posts', async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const response = content && (await postService.createPost(content));
        if (!response) {
            res.status(404).send({ message: 'Post not created' });
        } else {
            res.status(201).send({ 'Post created': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.post('/api/posts/generate', async (_req: Request, res: Response) => {
    try {
        const response = await postService.generatePost();
        if (!response) {
            res.status(404).send({ message: 'Post not generated' });
        } else {
            res.status(201).send({ 'Post generated': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/api/posts/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { content } = req.body;
        const response = content && (await postService.updatePost(id, content));
        if (!response) {
            res.status(404).send({ message: 'Post not found' });
        } else {
            res.status(200).send({ 'Post updated': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/api/posts/:id', async (req: Request, res: Response) => {
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
