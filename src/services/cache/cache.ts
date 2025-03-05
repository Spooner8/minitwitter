import { postsTable } from '../../schemas';
import IORedis from 'ioredis';
import { postService } from '../crud/posts';
import { logger } from '../log/logger';

const CACHE_ACTIVE = (process.env.CACHE_ACTIVE || 'true') === 'true';

let redis: IORedis;

export const initializeCache = async () => {
    if (redis || !CACHE_ACTIVE) return;
    logger.info('Initializing Redis Cache...');
    redis = new IORedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: null,
    });
    logger.info('Redis Cache initialized');
};

type Posts = Awaited<ReturnType<typeof getPostsFromDB>>;

export const getPosts = async () => {
    if (CACHE_ACTIVE && redis) {
        const posts = await getPostsFromCache();
        logger.info('Posts retrieved from cache.');
        if (posts) return posts;
    }

    const posts = await getPostsFromDB();
    logger.info('Posts retrieved from database.');
    if (CACHE_ACTIVE && redis) {
        await setPostsInCache(posts);
        logger.info('Posts stored in cache.');
    }
    return posts;
};

const getPostsFromCache = async (): Promise<Posts | null> => {
    if (!redis) return null;
    const cachedPosts = await redis.get('posts');
    if (!cachedPosts) return null;
    try {
        const posts = JSON.parse(cachedPosts) as Posts;
        return posts;
    } catch (error) {
        console.error('Error parsing posts from cache:', error);
        return null;
    }
};

const getPostsFromDB = async (): Promise<
    (typeof postsTable.$inferSelect)[]
> => {
    return await postService.getPosts();
};

const setPostsInCache = async (posts: Posts) => {
    if (!redis) return;
    try {
        await redis.set('posts', JSON.stringify(posts));
    } catch (error) {
        console.error('Error setting posts in cache:', error);
    }
};

export const invalidatePostsCache = async () => {
    if (!redis) return;
    try {
        await redis.del('posts');
        logger.info('Posts cache invalidated.');
    } catch (error) {
        console.error('Error invalidating posts cache:', error);
    }
};
