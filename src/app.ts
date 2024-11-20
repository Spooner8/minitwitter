import express from 'express';
import { initializeAPI } from './services/api.ts';

const app = express();

initializeAPI(app);
