import type { Request, Response } from 'express';
import { Router } from 'express';
import { postService } from '../services/crud/posts.ts';
import type { Post } from '../models/posts.ts';

const router = Router();

let posts: Post[] = [];

router.get('/api/posts', (_req: Request, res: Response) => {
    res.status(200).json(posts);
});

router.post('/api/posts', async (req: Request, res: Response) => {
    try {
        const { content } = req.body;
        const post = await postService.createPost(content);
        posts.push(post);
        res.status(201).json(posts[posts.length - 1]);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/api/posts/generate', async (_req: Request, res: Response) => {
    try {
        const post = await postService.generatePost();
        posts.push(post);
        res.status(201).json(posts[posts.length - 1]);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/api/posts/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    const { content } = req.body;
    const existingPost = posts.find((post) => post.id === id);
    if (!existingPost) {
        res.status(404).json({ message: 'Post not found' });
    } else {
        existingPost.content = content;
        res.status(200).json(posts[posts.length - 1]);
    }
});

router.delete('/api/posts/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    posts = posts.filter((post) => post.id !== id);
    res.status(200).json(posts);
});

export default router;
