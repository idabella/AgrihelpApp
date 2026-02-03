/**
 * LLM Service
 * Handles communication with the LLM API for agricultural advice
 */

export interface LLMRequest {
    message: string;
    language: 'darija' | 'french' | 'arabic';
    imageUrl?: string;
    conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface LLMResponse {
    response: string;
    confidence?: number;
    sources?: string[];
}

/**
 * Send a message to the LLM API
 */
export async function sendMessageToLLM(request: LLMRequest): Promise<LLMResponse> {
    try {
        // TODO: Replace with actual API endpoint
        const response = await fetch('/api/llm/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`LLM API error: ${response.statusText}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error calling LLM API:', error);
        throw error;
    }
}

/**
 * Stream responses from the LLM API
 */
export async function* streamLLMResponse(request: LLMRequest): AsyncGenerator<string> {
    try {
        // TODO: Implement streaming API
        const response = await fetch('/api/llm/stream', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            throw new Error(`LLM API error: ${response.statusText}`);
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) {
            throw new Error('No response body');
        }

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            yield chunk;
        }
    } catch (error) {
        console.error('Error streaming LLM response:', error);
        throw error;
    }
}
