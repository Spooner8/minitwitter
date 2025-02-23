import express from 'express';
import { initializeAPI } from './services/api.ts';
import { initializeMessageBroker } from './message-broker/index.ts';
import { initializeOllama } from './services/ai/ai.ts';
import { initializeCache } from './services/cache/cache';

const SERVER_ROLE = process.env.SERVER_ROLE || 'all';
const allowedRoles = ['all', 'api', 'worker'];
if (!allowedRoles.includes(SERVER_ROLE)) {
    console.error(`Invalid SERVER_ROLE: ${SERVER_ROLE}`);
    process.exit(1);
}
await initializeCache();
initializeMessageBroker();
await initializeOllama();

if (SERVER_ROLE === 'all' || SERVER_ROLE === 'api') {
    const app = express();
    
    initializeAPI(app);
}
