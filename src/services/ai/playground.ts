import { textAnalysis } from './ai'

// Array of texts to be analyzed
const texts = ['I love Canada!', 'The earth is flat']

// Loop through each text and analyze its sentiment
for (const text of texts) {
  // Analyze the sentiment of the text
  const sentiment = await textAnalysis(text)
  // Log the original text
  console.log(text)
  // Log the sentiment analysis result
  console.log(sentiment)
}
