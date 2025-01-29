import type { Request, Response, NextFunction } from "express";
import { Ollama } from "ollama";

const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const ollama = new Ollama({ host: OLLAMA_BASE_URL });

export const detectHateSpeech = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { content } = req.body;
        const result = await ollama.chat({
            model: 'llama3.2:1b',
            messages: [
                {
                    role: 'user',
                    content:
                        `Analyze the following text if it contains hate speech.
                        Be very strict and consider any form of offensive, abusive, or discriminatory language as hate speech.
                        If the text contains hate speech, return true, otherwise return false.
                        Text to analyze: "${content}"`,
                },
            ]
        });
        console.log({result: result.message.content.toLocaleLowerCase()});
        // check if the response contains true
        if (result.message.content.toLocaleLowerCase().includes('true')) {
            res.status(400).json({ message: 'Hate speech detected' });
        } else {
            next();
        }        
    } catch (error: any) {
        console.log(error);
        res.status(400).json({ message: error.message });
    }
};