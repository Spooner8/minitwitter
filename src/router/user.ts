import type { Request, Response } from 'express';
import { Router } from 'express';
import { userService } from '../services/crud/user.ts';

const router = Router();

router.post('/api/user/signup', async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await userService.createUser(username, password));
        if (!response) {
            res.status(401).send({ message: 'User not created' });
        } else {
            res.status(201).send({ 'User created': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/api/user', async (_req: Request, res: Response) => {
    console.log('Request angekommen');
    try {
        const users = await userService.getUsers();
        if (!users) {
            res.status(404).send({ message: 'Users not found' });
        } else {
            res.status(200).send(users);
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.get('/api/user/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const user = id && (await userService.getUserById(id));
        if (!user) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send(user);
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.put('/api/user/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const { username, password } = req.body;
        const response =
            username &&
            password &&
            (await userService.updateUser(id, username, password));
        if (!response) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ 'User updated': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

router.delete('/api/user/:id', async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const response = id && (await userService.deleteUser(id));
        if (!response) {
            res.status(404).send({ message: 'User not found' });
        } else {
            res.status(200).send({ 'User deleted': response });
        }
    } catch (error: any) {
        console.log(error);
        res.status(400).send({ message: error.message });
    }
});

export default router;
