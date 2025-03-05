import { Ollama } from 'ollama'
import { z } from 'zod'
import zodToJsonSchema from 'zod-to-json-schema'
import 'dotenv/config'

// Test other models from ollama
// ⚠️ Not more than 7 billion parameters ⚠️
export const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.2:1b'

export let ollama: Ollama

export const initializeOllama = async () => {
  if (ollama) return
  logger.info('Initializing Ollama...')
  const OLLAMA_HOST = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  logger.info('Initializing Ollama with model:', OLLAMA_MODEL)
  logger.info('Using Ollama host:', OLLAMA_HOST)
  ollama = new Ollama({
    host: OLLAMA_HOST,
  })
  logger.info('Pulling model from server... This can take a few minutes')
  await ollama.pull({ model: OLLAMA_MODEL })
}

const TextAnalysisResult = z.object({
  sentiment: z.enum(['ok', 'dangerous']),
  correction: z.string(),
})

export async function textAnalysis(text: string) {
  const response = await ollama.chat({
    model: OLLAMA_MODEL,
    messages: [
      { 
        role: 'user',
        content: `Analyze the following text for harmful or wrong content: ${text}. Please provide both a sentiment (either 'ok' or 'dangerous') and a correction with info why is it ok or dangerous. Make sure, hte correction has not more than 200 characters in total.` }],
    format: zodToJsonSchema(TextAnalysisResult),
  })
  logger.info('Analysis done')
  return JSON.parse(response.message.content) as z.infer<typeof TextAnalysisResult>
}
