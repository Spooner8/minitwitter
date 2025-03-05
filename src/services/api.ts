import { type Express } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { httpLogger } from '../services/logger.ts';
import { logger } from '../services/logger.ts';

const PORT = process.env.API_PORT || 3000;



// Routers
import postsRouter from '../router/posts.ts';
import authRouter from '../router/auth.ts';
import userRouter from '../router/user.ts';

export const initializeAPI = (app: Express) => {
    const allowedOrigins = [
        'http://localhost:80',
        'http://localhost:4000'
    ];

    const corsOptions = {
        origin: allowedOrigins,
        credentials: true,
    };
    app.use(httpLogger);
    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));

    // Router
    app.use(postsRouter);
    app.use(authRouter);
    app.use(userRouter);

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
};
