import type { Request, Response } from 'express';
import { Router } from 'express';
import { authService } from '../services/auth/auth.ts';

const router = Router();

// Route to handle user login
router.post('/api/auth/login', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await authService.login(username, password, res));
        if (!response) {
            // If login fails, respond with 401 Unauthorized
            res.status(401).send({ message: 'User not found' });
        } else {
            // If login succeeds, respond with the user data
            res.status(200).send(response);
        }
    } catch (error: any) {
        // Handle any errors and respond with 400 Bad Request
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

// Route to handle user logout
router.get('/api/auth/logout', (_req: Request, res: Response) => {
    try {
        authService.logout(res);
    } catch (error: any) {
        // Handle any errors and respond with 400 Bad Request
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

// Route to check the login status of the user
router.get('/api/auth/loginstatus', async (req: Request, res: Response) => {
    try {
        const user = await authService.getCurrentUser(req, res);
        if (user) {
            // If user is logged in, respond with the user data
            res.status(200).json({ isLoggedIn: true, user });
        } else {
            // If user is not logged in, respond with isLoggedIn: false
            res.status(200).json({ isLoggedIn: false });
        }
    } catch (error: any) {
        // Handle any errors and respond with 400 Bad Request
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

export default router;
