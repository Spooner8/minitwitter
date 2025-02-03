import express from 'express';
import { initializeAPI } from './services/api.ts';
import { initializeMessageBroker } from './message-broker/index.ts';


const app = express();

initializeMessageBroker();
initializeAPI(app);