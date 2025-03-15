import { type Express } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { limiter } from '../middleware/rate-limiter.ts';
import { httpLogger, logger } from './log/logger.ts';
import { prometheus } from '../middleware/prometheus.ts';

// Routers
import postsRouter from '../router/posts.ts';
import authRouter from '../router/auth.ts';
import userRouter from '../router/user.ts';

const PORT = process.env.API_PORT || 3000;
const LIMITER = (process.env.RATE_LIMITER || 'true') === 'true';

/**
 * @description
 * Initialize the API server
 * 
 * @param {Express} app - Express app
 */
export const initializeAPI = (app: Express) => {
    const allowedOrigins = ['http://localhost:80', 'http://localhost:4000'];

    const corsOptions = {
        origin: allowedOrigins,
        credentials: true,
    };

    app.use(prometheus);

    app.use(bodyParser.json());
    app.use(cookieParser());
    app.use(cors(corsOptions));

    LIMITER && app.use(limiter);
    app.use(httpLogger);

    // Router
    app.use(postsRouter);
    app.use(authRouter);
    app.use(userRouter);

    app.listen(PORT, () => {
        logger.info(`Server is running on port ${PORT}`);
    });
};
