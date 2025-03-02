import { desc, eq } from 'drizzle-orm';
import { db } from '../database';
import { postsTable, usersTable } from '../../schemas';
import IORedis from 'ioredis';
import { postService } from '../crud/posts';
import type { infer, TypeOf } from 'zod';

const CACHE_ACTIVE = (process.env.CACHE_ACTIVE || 'true') === 'true';

let redis: IORedis;

export const initializeCache = async () => {
    if (redis || !CACHE_ACTIVE) return;
    console.log('Initializing Redis Cache...');
    redis = new IORedis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        maxRetriesPerRequest: null,
    });
    console.log('Redis Cache initialized');
};

type Posts = Awaited<ReturnType<typeof getPostsFromDB>>;

export const getPosts = async (userId?: number) => {
    if (CACHE_ACTIVE && redis) {
        const posts = await getPostsFromCache();
        console.log('Posts retrieved from cache.');
        console.log('Posts:', posts);
        if (posts) return posts;
    }

    const posts = await getPostsFromDB();
    console.log('Posts retrieved from database.');
    if (CACHE_ACTIVE && redis) {
        await setPostsInCache(posts);
        console.log('Posts stored in cache.');
    }
    return posts;

    // 4. Filtere Posts nach userId (falls angegeben) und schließe Posts mit sentiment "dangerous" aus
    // 5. Rückgabe der gefilterten Posts
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
        console.log('Posts cache invalidated.');
    } catch (error) {
        console.error('Error invalidating posts cache:', error);
    }
};

