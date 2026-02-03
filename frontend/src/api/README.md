# API Directory

This directory contains API configuration and utilities for backend integration.

## Files

### `config.ts`
Central configuration for all API endpoints, timeouts, and headers.

**Features:**
- API base URL configuration
- Endpoint definitions for all services
- Timeout configurations
- Retry logic configuration
- Authentication header helpers

## Usage

### Getting API URLs
```typescript
import { getApiUrl, API_CONFIG } from '@/api/config';

const chatUrl = getApiUrl(API_CONFIG.llm.chat);
// Returns: 'http://localhost:3000/api/llm/chat'
```

### Using API Headers
```typescript
import { getApiHeaders } from '@/api/config';

const response = await fetch(url, {
  method: 'POST',
  headers: getApiHeaders(), // Includes auth token if available
  body: JSON.stringify(data),
});
```

## Environment Variables

Create a `.env` file in the project root:

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:3000

# Optional: API Keys (if needed)
VITE_OPENAI_API_KEY=your_key_here
VITE_VISION_API_KEY=your_key_here
```

## Backend Setup

### Required Endpoints

Your backend should implement these endpoints:

#### LLM Endpoints
- `POST /api/llm/chat` - Chat with LLM
- `POST /api/llm/stream` - Stream LLM responses

#### Image Analysis Endpoints
- `POST /api/image/upload` - Upload image
- `POST /api/image/analyze` - Analyze image
- `POST /api/image/analyze-base64` - Analyze base64 image

#### Authentication Endpoints
- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/signout` - Sign out
- `POST /api/auth/refresh` - Refresh token

## CORS Configuration

Make sure your backend allows requests from your frontend:

```javascript
// Express.js example
app.use(cors({
  origin: 'http://localhost:5173', // Vite dev server
  credentials: true,
}));
```

## Error Handling

All API calls should handle errors appropriately:

```typescript
try {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }
  
  return await response.json();
} catch (error) {
  console.error('API call failed:', error);
  // Handle error (show toast, retry, etc.)
  throw error;
}
```
