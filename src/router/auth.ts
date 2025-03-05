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
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/api/auth/logout', (_req: Request, res: Response) => {
    try {
        authService.logout(res);
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/api/auth/loginstatus', async (req: Request, res: Response) => {
    try {
        const user = await authService.getCurrentUser(req, res);
    if (user) {
        res.status(200).json({ isLoggedIn: true, user });
    } else {
        res.status(200).json({ isLoggedIn: false });
    }
    } catch (error: any) {
        logger.error(error);
        res.status(400).send({ message: error.message });
    }
});

export default router;
