# Services Directory

This directory contains service modules for backend API integration.

## Structure

```
services/
├── index.ts                    # Central export point
├── llmService.ts              # LLM API integration
└── imageAnalysisService.ts    # Image analysis API integration
```

## Services

### LLM Service (`llmService.ts`)
Handles communication with the LLM API for agricultural advice and chat functionality.

**Features:**
- Send messages to LLM API
- Stream responses for real-time chat
- Support for multiple languages (Darija, Arabic, French)
- Conversation history management
- Image-based queries

**Usage:**
```typescript
import { sendMessageToLLM } from '@/services';

const response = await sendMessageToLLM({
  message: 'What is wrong with my tomato plant?',
  language: 'english',
  imageUrl: 'https://...',
});
```

### Image Analysis Service (`imageAnalysisService.ts`)
Handles crop disease detection and plant health analysis.

**Features:**
- Upload and analyze images
- Detect crop diseases
- Provide treatment recommendations
- Support for multiple upload methods (file, base64, URL)
- Multi-language diagnosis

**Usage:**
```typescript
import { uploadAndAnalyzeImage } from '@/services';

const analysis = await uploadAndAnalyzeImage(file, 'english');
console.log(analysis.detections); // Disease detections
console.log(analysis.treatment);  // Treatment recommendations
```

## API Configuration

API endpoints and configuration are centralized in `src/api/config.ts`.

### Environment Variables

Add these to your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3000
```

## Backend Integration TODO

### 1. LLM API Endpoints
Create these endpoints in your backend:
- `POST /api/llm/chat` - Send a message and get a response
- `POST /api/llm/stream` - Stream LLM responses

### 2. Image Analysis Endpoints
Create these endpoints in your backend:
- `POST /api/image/upload` - Upload an image file
- `POST /api/image/analyze` - Analyze an image URL
- `POST /api/image/analyze-base64` - Analyze a base64 image

### 3. Authentication
The services are ready to include authentication tokens. Implement:
- Token storage in localStorage
- Token refresh mechanism
- Protected API routes

## Example Backend Structure

```
backend/
├── routes/
│   ├── llm.js          # LLM endpoints
│   ├── image.js        # Image analysis endpoints
│   └── auth.js         # Authentication endpoints
├── services/
│   ├── openai.js       # OpenAI/LLM integration
│   └── vision.js       # Computer vision integration
└── middleware/
    └── auth.js         # Authentication middleware
```

## Testing

Before connecting to real APIs, you can mock the responses:

```typescript
// Mock LLM response
export async function sendMessageToLLM(request: LLMRequest): Promise<LLMResponse> {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    response: 'This is a mock response',
    confidence: 0.95,
  };
}
```
