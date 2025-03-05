import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { postService } from '../services/crud/posts';
import { textAnalysis } from '../services/ai/ai';
import { logger } from '../services/log/logger';

let sentimentQueue: Queue;
let sentimentWorker: Worker;

const SERVER_ROLE = process.env.SERVER_ROLE || 'all';

export const initializeMessageBroker = () => {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379');
  const connection = new IORedis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
  });
  logger.info(`Connecting to Redis at ${redisHost}:${redisPort}`);

  sentimentQueue = new Queue('sentiment', { connection });
  logger.info('Sentiment queue initialized');

  if (SERVER_ROLE === 'all' || SERVER_ROLE === 'worker') {
    sentimentWorker = new Worker('sentiment', analyzeSentiment, { connection });
    logger.info('Message worker initialized');
  }
};

const analyzeSentiment = async (job: Job) => {
  try {
    const { postId } = job.data;

    const post = await postService.getPostById(postId);
    if (!post) {
      logger.error(`Post with ID ${postId} not found`);
      return;
    }

    const analysisResult = await textAnalysis(post.content);

    await postService.updatePost(postId, {
      sentiment: analysisResult.sentiment,
      correction: analysisResult.correction,
    });

  } catch (error) {
    logger.error('Error while analyzing sentiment:', error);
  }
};

export { sentimentQueue };
