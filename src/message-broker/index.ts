import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { postService } from '../services/crud/posts';
import { textAnalysis } from '../services/ai/ai';

let sentimentQueue: Queue;
let sentimentWorker: Worker;

export const initializeMessageBroker = () => {
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379');
  const connection = new IORedis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
  });
  console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

  sentimentQueue = new Queue('sentiment', { connection });
  sentimentWorker = new Worker('sentiment', analyzeSentiment, { connection });

  console.log('Message broker initialized');
};

const analyzeSentiment = async (job: Job) => {
  try {
    const { postId } = job.data;

    const post = await postService.getPostById(postId);
    if (!post) {
      console.error(`Post with ID ${postId} not found`);
      return;
    }

    const analysisResult = await textAnalysis(post.content);

    await postService.updatePost(postId, {
      sentiment: analysisResult.sentiment,
      correction: analysisResult.correction,
    });

  } catch (error) {
    console.error('Error while analyzing sentiment:', error);
  }
};

export { sentimentQueue };
