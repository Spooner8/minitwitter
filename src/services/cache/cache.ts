import { postsTable } from '../../schemas';
import IORedis from 'ioredis';
import { postService } from '../crud/posts';
import { logger } from '../log/logger';

const CACHE_ACTIVE = (process.env.CACHE_ACTIVE || 'true') === 'true';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

let redis: IORedis;

/**
 * @description
 * Initializes the Redis cache if it is set to active.  
 * If the cache is already initialized or not active, it does nothing.
 */
export const initializeCache = async () => {
    if (redis || !CACHE_ACTIVE) return;
    logger.info('Initializing Redis Cache...');
    redis = new IORedis({
        host: REDIS_HOST,
        port: REDIS_PORT,
        maxRetriesPerRequest: null,
    });
    logger.info('Redis Cache initialized');
};

type Posts = Awaited<ReturnType<typeof getPostsFromDB>>;

/**
 * @description
 * Retrieves the posts from the cache if it is active and the posts are stored in it, otherwise from the database.
 * 
 * @returns {Promise<Posts>} The posts from the cache if it is active and the posts are stored in it, otherwise from the database.
 */
export const getPosts = async (): Promise<Posts> => {
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

/**
 * @description
 * Retrieves the posts from the cache if it is active and the posts are stored in it, otherwise null.
 * 
 * @returns {Promise<Posts | null>} The posts from the cache if it is active and the posts are stored in it, otherwise null.
 */
const getPostsFromCache = async (): Promise<Posts | null> => {
    if (!redis) return null;
    const cachedPosts = await redis.get('posts');
    if (!cachedPosts) return null;
    try {
        const posts = JSON.parse(cachedPosts) as Posts;
        return posts;
    } catch (error) {
        logger.error('Error parsing posts from cache:', error);
        return null;
    }
};

/**
 * @description
 * Retrieves the posts from the database.
 * 
 * @returns {Promise<(typeof postsTable.$inferSelect)[]>} The posts from the database.
 */
const getPostsFromDB = async (): Promise<
    (typeof postsTable.$inferSelect)[]
> => {
    return await postService.getPosts();
};

/**
 * @description
 * Stores the posts in the cache if it is active.
 * 
 * @param {Posts} posts The posts to store in the cache.
 */
const setPostsInCache = async (posts: Posts) => {
    if (!redis) return;
    try {
        await redis.set('posts', JSON.stringify(posts));
    } catch (error) {
        logger.error('Error setting posts in cache:', error);
    }
};

/**
 * @description
 * Invalidates the posts cache.
 */
export const invalidatePostsCache = async () => {
    if (!redis) return;
    try {
        await redis.del('posts');
        logger.info('Posts cache invalidated.');
    } catch (error) {
        logger.error('Error invalidating posts cache:', error);
    }
};

