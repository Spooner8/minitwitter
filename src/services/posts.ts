import ollama from 'ollama';
import { v4 as uuidv4 } from 'uuid';
import type { Post } from '../models/posts';

export const postService = {
    createPost,
    generatePost,
};

async function createPost(content: string): Promise<Post> {
    const id = uuidv4();
    const post: Post = { id, content };
    return post;
}

async function generatePost() {
    const response = await ollama.chat({
        model: 'llama3.2:1b',
        messages: [
            {
                role: 'user',
                content:
                    'Create a short random twitter-post with maximum 140 characters.',
            },
        ],
    });

    const post: Post = {
        id: uuidv4(),
        content: response.message.content,
    };

    return post;
}
