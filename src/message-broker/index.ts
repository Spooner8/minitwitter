import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { postService } from '../services/crud/posts';
import { textAnalysis } from '../services/ai/ai';
import { logger } from '../services/log/logger';

let sentimentQueue: Queue;
let sentimentWorker: Worker;

// Determine the server role from environment variables
const SERVER_ROLE = process.env.SERVER_ROLE || 'all';
const REDIS_HOST = process.env.REDIS_HOST || 'localhost';
const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379');

/**
 * @description
 * Initialize message broker with Redis connection.  
 * If the server role is 'all' or 'worker', a worker is created to process sentiment analysis jobs.
 * 
 * Environment variables:
 * @env REDIS_HOST - URL for Redis connection
 * @env REDIS_PORT - Port for Redis connection
 * @env SERVER_ROLE - Role to be performed by the server (all, worker, api)
 */
export const initializeMessageBroker = () => {
  const connection = new IORedis({
    host: REDIS_HOST,
    port: REDIS_PORT,
    maxRetriesPerRequest: null,
  });
  logger.info(`Connecting to Redis at ${REDIS_HOST}:${REDIS_PORT}`);

  // Initialize the sentiment queue
  sentimentQueue = new Queue('sentiment', { connection });
  logger.info('Sentiment queue initialized');

  // Initialize the sentiment worker if the server role is 'all' or 'worker'
  if (SERVER_ROLE === 'all' || SERVER_ROLE === 'worker') {
    sentimentWorker = new Worker('sentiment', analyzeSentiment, { connection });
    logger.info('Message worker initialized');
  }
};

/**
 * @description
 * Analyze sentiment of a new or updated post
 * 
 * @param {job} job Job to be processed
 * @returns 
 */
const analyzeSentiment = async (job: Job) => {
  try {
    // Get the post ID from the job data
    const { postId } = job.data;

    // Fetch the post by ID
    const post = await postService.getPostById(postId);
    if (!post) {
      logger.error(`Post with ID ${postId} not found`);
      return;
    }

    // Perform text analysis on the post content
    const analysisResult = await textAnalysis(post.content);

    // Update the post with the analysis results
    await postService.updatePost(postId, {
      sentiment: analysisResult.sentiment,
      correction: analysisResult.correction,
    });

  } catch (error) {
    logger.error('Error while analyzing sentiment:', error);
  }
};

// Export the sentiment queue
export { sentimentQueue };
