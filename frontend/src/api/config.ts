/**
 * API Configuration
 * Central configuration for all API endpoints
 */

// API Base URLs
export const API_CONFIG = {
    // Base URL for the backend API
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',

    // LLM API endpoints
    llm: {
        chat: '/api/llm/chat',
        stream: '/api/llm/stream',
    },

    // Image Analysis API endpoints
    image: {
        upload: '/api/image/upload',
        analyze: '/api/image/analyze',
        analyzeBase64: '/api/image/analyze-base64',
    },

    // Authentication endpoints
    auth: {
        signIn: '/api/auth/signin',
        signUp: '/api/auth/signup',
        signOut: '/api/auth/signout',
        refresh: '/api/auth/refresh',
    },
};

// API timeout configuration (in milliseconds)
export const API_TIMEOUTS = {
    default: 30000, // 30 seconds
    image: 60000,   // 60 seconds for image uploads
    llm: 120000,    // 2 minutes for LLM responses
};

// API retry configuration
export const API_RETRY = {
    maxRetries: 3,
    retryDelay: 1000, // 1 second
};

/**
 * Get full API URL
 */
export function getApiUrl(endpoint: string): string {
    return `${API_CONFIG.baseUrl}${endpoint}`;
}

/**
 * Common headers for API requests
 */
export function getApiHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };

    if (includeAuth) {
        // TODO: Add authentication token from context/storage
        const token = localStorage.getItem('auth_token');
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
    }

    return headers;
}
