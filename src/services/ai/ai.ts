import { Ollama } from 'ollama';
import { z } from 'zod';
import zodToJsonSchema from 'zod-to-json-schema';
import 'dotenv/config';
import { logger } from '../log/logger.ts';

// Test other models from ollama
// ⚠️ Not more than 7 billion parameters ⚠️
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b';
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';

export let ollama: Ollama;

/**
 * @description  
 * Initializes the Ollama service with the specified model.  
 * If the service is already initialized, it will return immediately.  
 * It will pull the model from the server, which can take a few minutes.
 */
export const initializeOllama = async (): Promise<void> => {
    if (ollama) return;
    logger.info('Initializing Ollama...');
    const OLLAMA_HOST = OLLAMA_BASE_URL;
    logger.info('Initializing Ollama with model:', OLLAMA_MODEL);
    logger.info('Using Ollama host:', OLLAMA_HOST);
    ollama = new Ollama({
        host: OLLAMA_HOST,
    });
    logger.info('Pulling model from server... This can take a few minutes');
    await ollama.pull({ model: OLLAMA_MODEL });
};

/**
 * @description  
 * Structure of the response from the Ollama service.
 */
const TextAnalysisResult = z.object({
    sentiment: z.enum(['ok', 'dangerous']),
    correction: z.string(),
});

/**
 * @description  
 * Analyzes the text for harmful or wrong content.
 * 
 * @param {text} text
 * @returns {Promise<TextAnalysisResult>}
 */
export async function textAnalysis(text: string): Promise<z.infer<typeof TextAnalysisResult>> {
    const response = await ollama.chat({
        model: OLLAMA_MODEL,
        messages: [
            {
                role: 'user',
                content: `Analyze the following text for harmful or wrong content: ${text}. Please provide both a sentiment (either 'ok' or 'dangerous') and a correction with info why is it ok or dangerous. Make sure, hte correction has not more than 200 characters in total.`,
            },
        ],
        format: zodToJsonSchema(TextAnalysisResult),
    });
    logger.info('Analysis done');
    return JSON.parse(response.message.content) as z.infer<
        typeof TextAnalysisResult
    >;
}
