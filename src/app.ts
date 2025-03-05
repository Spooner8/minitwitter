import express from 'express';
import { initializeAPI } from './services/api.ts';
import { initializeMessageBroker } from './message-broker/index.ts';
import { initializeOllama } from './services/ai/ai.ts';
import { initializeCache } from './services/cache/cache.ts';
import { logger } from './services/log/logger.ts';

const SERVER_ROLE = process.env.SERVER_ROLE || 'all';
const allowedRoles = ['all', 'api', 'worker'];
if (!allowedRoles.includes(SERVER_ROLE)) {
    logger.error(`Invalid SERVER_ROLE: ${SERVER_ROLE}`);
    process.exit(1);
}

initializeMessageBroker();
await initializeOllama();

if (SERVER_ROLE === 'all' || SERVER_ROLE === 'api') {
    const app = express();
    await initializeCache();
    initializeAPI(app);
}
