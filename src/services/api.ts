import { type Express } from 'express';
import bodyParser from 'body-parser';
import 'dotenv/config';

const PORT = process.env.APP_PORT || 3000;

// Routers
import postsRouter from '../router/posts.ts';

export const initializeAPI = (app: Express) => {
    app.use(bodyParser.json());

    // Router
    app.use(postsRouter);

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
};
