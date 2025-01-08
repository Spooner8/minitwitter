import { type Express } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const PORT = process.env.APP_PORT || 3000;

// Routers
import postsRouter from '../router/posts.ts';
import authRouter from '../router/auth.ts';
import userRouter from '../router/user.ts';

export const initializeAPI = (app: Express) => {
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors());

    // Router
    app.use(postsRouter);
    app.use(authRouter);
    app.use(userRouter);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
