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
  console.log('Initializing Ollama...')
  const OLLAMA_HOST = process.env.OLLAMA_BASE_URL || 'http://localhost:11434'
  console.log('Initializing Ollama with model:', OLLAMA_MODEL)
  console.log('Using Ollama host:', OLLAMA_HOST)
  ollama = new Ollama({
    host: OLLAMA_HOST,
  })
  console.log('Pulling model from server... This can take a few minutes')
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
        content: `Analysiere den folgenden Text streng auf Hassrede (Hate Speech).  
**Definition von Hassrede:**  
- Jegliche Form von abwertender, hetzerischer, gewaltfördernder oder diskriminierender Sprache.  
- Bezieht sich auf Merkmale wie Ethnizität, Religion, Geschlecht, Sexualität, Behinderung, Herkunft oder andere schützenswerte Gruppen.  
- Inklusive direkter Beleidigungen, indirekter Andeutungen, Stereotype, Bedrohungen oder entmenschlichender Sprache.  

**Anweisungen:**  
1. Sei **maximal streng**: Auch subtile Anspielungen oder "versteckte" Hassrede (Dog Whistles) als positiv markieren.  
2. Kontext ignorieren: Selbst ironisch/zitierte Aussagen gelten als Hassrede.  
3. Sprachspezifische Nuancen in Deutsch/Englisch prüfen (z.B. deutsche Beleidigungen vs. englische Slang-Ausdrücke): ${text}. Please provide both a sentiment (either 'ok' or 'dangerous') and a correction with info why is it ok or dangerous. Make sure, hte correction has not more than 255 characters in total.` }],
    format: zodToJsonSchema(TextAnalysisResult),
  })
  console.log('Analysis done')
  return JSON.parse(response.message.content) as z.infer<typeof TextAnalysisResult>
}
