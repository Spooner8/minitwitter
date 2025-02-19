import { desc, eq } from 'drizzle-orm';
import { db } from '../database';
import { postsTable, usersTable } from '../../schemas';
import IORedis from 'ioredis';

const CACHE_ACTIVE = (process.env.CACHE_ACTIVE || 'true') === 'true';

let redis: IORedis | undefined;

export const initializeCache = async () => {
  if (redis || !CACHE_ACTIVE) return;
  console.log('Initializing Redis Cache...');
  redis = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null,
  });
  console.log('Redis Cache initialized');
};

// Der Typ Posts basiert auf dem Rückgabewert von getPostsFromDB
type Posts = Awaited<ReturnType<typeof getPostsFromDB>>; // Beispiel: Post[]

// Hauptfunktion, die Posts zurückgibt
export const getPosts = async (userId?: number): Promise<Posts> => {
  // 1. Check if Cache is active
  if (CACHE_ACTIVE && redis) {
    // 2. Versuche, Posts aus dem Cache zu holen
    const posts = await getPostsFromCache();
    if (posts) {
      return posts;
    }
  }

  // 3. Hole Posts direkt aus der DB
  const posts = await getPostsFromDB();
  if (!posts) return [];
  console.log('Posts retrieved from database.');

  // 4. Falls Cache aktiv, speichere die Posts im Cache
  if (CACHE_ACTIVE && redis) {
    await setPostsInCache(posts);
    console.log('Posts stored in cache.');
  }
  return posts;
};

// Funktion, um alle Posts aus dem Redis-Cache zu holen
const getPostsFromCache = async (): Promise<Posts | null> => {
  if (!redis) return null;
  const cachedPosts = await redis.get('posts');
  if (!cachedPosts) return null;
  try {
    const posts: Posts = JSON.parse(cachedPosts);
    return posts;
  } catch (error) {
    console.error('Error parsing posts from cache:', error);
    return null;
  }
};

// Funktion, um alle Posts aus der Datenbank zu holen
const getPostsFromDB = async (): Promise<any[]> => {
  // Hier wird ein simuliertes DB-Ergebnis zurückgegeben.
  // In einer echten Anwendung erfolgt hier die Datenbankabfrage.
  const posts = await db
    .select()
    .from(postsTable)
    .orderBy(postsTable.created_at);
  return posts; // explizites Return hinzufügen
};

// Funktion, um den "posts"-Key im Redis-Cache zu setzen
const setPostsInCache = async (posts: Posts): Promise<void> => {
  if (!redis) return;
  try {
    await redis.set('posts', JSON.stringify(posts));
  } catch (error) {
    console.error('Error setting posts in cache:', error);
  }
};

// Funktion, um den "posts"-Key im Redis-Cache zu löschen
export const invalidatePostsCache = async (): Promise<void> => {
  if (!redis) return;
  try {
    await redis.del('posts');
    console.log('Posts cache invalidated.');
  } catch (error) {
    console.error('Error invalidating posts cache:', error);
  }
};
