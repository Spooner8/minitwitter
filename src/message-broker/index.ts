// src/message-broker/index.ts

import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';

/**
 * Wir verwenden hier ioredis als Verbindungsschicht,
 * da BullMQ diese Library für Redis-Operationen nutzt.
 */
let sentimentQueue: Queue;
let sentimentWorker: Worker;

/**
 * Initialisiert das Message-Broker-System.
 * Sollte beim Starten der App (z. B. in app.ts) aufgerufen werden.
 */
export const initializeMessageBroker = () => {
  const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    maxRetriesPerRequest: null,
  });

  // Die Queue, in die wir Jobs einstellen können
  sentimentQueue = new Queue('sentiment', { connection });

  // Ein Worker, der neue Jobs aus der 'sentiment'-Queue abarbeitet
  sentimentWorker = new Worker('sentiment', analyzeSentiment, { connection });

  console.log('Message broker initialized');
};

/**
 * Unsere Verarbeitungslogik für den "sentiment"-Job.
 * Hier können Sie spätere Schritte einbauen:
 * 1. Post aus der Datenbank laden
 * 2. Sentiment-Analyse durchführen (KI-Aufruf)
 * 3. Ergebnis in der Datenbank speichern
 */
const analyzeSentiment = async (job: Job) => {
  console.log(job.data);
  // 1. Generiere Job wenn ein neuer Post erstellt wird (in api/posts.ts)
  // 2. Hole den Post aus der Datenbank
  // 3. Analysiere den Post (services/ai.ts -> textAnalysis)
  // 4. Aktualisiere den Post mit dem Sentiment
};

/**
 * Exportiert, damit wir von außen Jobs hinzufügen können.
 * Beispiel:
 * sentimentQueue.add('taskName', { postId: 123 });
 */
export { sentimentQueue };
