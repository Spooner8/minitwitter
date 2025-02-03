import express from 'express';
import { initializeAPI } from './services/api.ts';
import { initializeMessageBroker } from './message-broker/index.ts';
import { initializeOllama } from './services/ai/ai.ts';


const app = express();

initializeMessageBroker();
initializeAPI(app);
await initializeOllama();