import { desc, eq } from 'drizzle-orm'
import { db } from '../database'
import { postsTable, usersTable } from '../../schemas'
import IORedis from 'ioredis'

const CACHE_ACTIVE = (process.env.CACHE_ACTIVE || 'true') === 'true'

let redis: IORedis

export const initializeCache = async () => {
  if (redis || !CACHE_ACTIVE) return
  console.log('Initializing Redis Cache...')
  redis = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    maxRetriesPerRequest: null,
  })
  console.log('Redis Cache initialized')
}

export const closeCache = async () => {
  if (!redis) return
  console.log('Closing Redis Cache...')
  await redis.quit()
  console.log('Redis Cache closed')
}

// Der Typ Posts basiert auf dem Rückgabewert von getPostsFromDB
type Posts = Awaited<ReturnType<typeof getPostsFromDB>>;

// Hauptfunktion, die Posts zurückgibt
export const getPosts = async (userId?: number): Promise<Posts[]> => {
  let posts: Posts[] | null = null;

  // 1. Check if Cache is active
  if (CACHE_ACTIVE && redis) {
    // 2. Wenn Cache aktiv: Versuche, Posts aus dem Cache zu holen
    posts = await getPostsFromCache();
    // 2.1 Falls Posts im Cache vorhanden sind, wurde dies geloggt
    if (posts) {
      console.log('Posts retrieved from cache.');
    }
  }

  // 3. Falls Posts nicht im Cache sind, hole sie direkt aus der Datenbank
  if (!posts) {
    posts = await getPostsFromDB();
    console.log('Posts retrieved from database.');
    // 2.2 Wenn Posts nicht im Cache waren, hole sie aus der DB
    // 2.3 Speichere die Posts im Cache
    if (CACHE_ACTIVE && redis) {
      await setPostsInCache(posts);
      console.log('Posts stored in cache.');
    }
  }

  // 4. Filtere Posts nach userId (falls angegeben) und schließe Posts mit sentiment "dangerous" aus
  let filteredPosts = posts;
  if (userId !== undefined) {
    filteredPosts = filteredPosts.filter(post => postsTable.userId === userId);
  }
  filteredPosts = filteredPosts.filter(post => post.sentiment !== 'dangerous');

  // 5. Rückgabe der gefilterten Posts
  return filteredPosts;
};

// Funktion, um alle Posts aus dem Redis-Cache zu holen
const getPostsFromCache = async (): Promise<Posts[] | null> => {
  if (!redis) return null;
  const cachedPosts = await redis.get('posts');
  if (!cachedPosts) return null;
  try {
    const posts: Posts[] = JSON.parse(cachedPosts);
    return posts;
  } catch (error) {
    console.error('Error parsing posts from cache:', error);
    return null;
  }
};

// Funktion, um alle Posts aus der Datenbank zu holen
const getPostsFromDB = async (): Promise<Posts[]> => {
  // Hier wird ein simuliertes DB-Ergebnis zurückgegeben.
  // In einer echten Anwendung würden hier Datenbankabfragen erfolgen.
  return new Promise(resolve => {
    setTimeout(() => {
      const dummyPosts: Posts[] = [
        { id: 1, userId: 1, content: 'Hello World', sentiment: 'neutral' },
        { id: 2, userId: 2, content: 'This is dangerous content', sentiment: 'dangerous' },
        { id: 3, userId: 1, content: 'Another post', sentiment: 'positive' },
        { id: 4, userId: 3, content: 'Some random post', sentiment: 'negative' },
      ];
      resolve(dummyPosts);
    }, 100); // Simuliere eine 100ms Verzögerung
  });
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