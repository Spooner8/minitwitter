import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { postService } from '../services/crud/posts';
import { textAnalysis } from '../services/ai/ai';

let sentimentQueue: Queue;
let sentimentWorker: Worker;

// Determine the server role from environment variables
const SERVER_ROLE = process.env.SERVER_ROLE || 'all';

// Function to initialize the message broker
export const initializeMessageBroker = () => {
  // Get Redis connection details from environment variables
  const redisHost = process.env.REDIS_HOST || 'localhost';
  const redisPort = parseInt(process.env.REDIS_PORT || '6379');
  const connection = new IORedis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null,
  });
  console.log(`Connecting to Redis at ${redisHost}:${redisPort}`);

  // Initialize the sentiment queue
  sentimentQueue = new Queue('sentiment', { connection });
  console.log('Sentiment queue initialized');

  // Initialize the sentiment worker if the server role is 'all' or 'worker'
  if (SERVER_ROLE === 'all' || SERVER_ROLE === 'worker') {
    sentimentWorker = new Worker('sentiment', analyzeSentiment, { connection });
    console.log('Message worker initialized');
  }
};

// Function to analyze sentiment of a post
const analyzeSentiment = async (job: Job) => {
  try {
    // Get the post ID from the job data
    const { postId } = job.data;

    // Fetch the post by ID
    const post = await postService.getPostById(postId);
    if (!post) {
      console.error(`Post with ID ${postId} not found`);
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
    console.error('Error while analyzing sentiment:', error);
  }
};

// Export the sentiment queue
export { sentimentQueue };
