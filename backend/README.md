# AgriHelp Backend

This directory is a placeholder for the backend API implementation.

## Overview

The AgriHelp backend will provide REST API endpoints for:
- AI-powered agricultural advice and crop disease diagnosis
- Image analysis for disease detection
- User authentication and session management
- Conversation history persistence

## Required API Endpoints

### Chat & LLM
```
POST /api/llm/chat      - Send message to AI
POST /api/llm/stream    - Stream AI responses
```

### Image Analysis
```
POST /api/image/upload           - Upload image
POST /api/image/analyze          - Analyze for diseases
POST /api/image/analyze-base64   - Analyze base64 image
```

### Authentication
```
POST /api/auth/signin    - User login
POST /api/auth/signup    - User registration
POST /api/auth/signout   - User logout
POST /api/auth/refresh   - Refresh token
```

## Technology Stack Recommendations

### Option 1: Node.js/Express
```bash
npm init -y
npm install express cors dotenv
npm install --save-dev typescript @types/node @types/express
```

### Option 2: Python/FastAPI
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install fastapi uvicorn python-multipart
```

### Option 3: Java/Spring Boot
```bash
# Use Spring Initializr or Maven/Gradle
```

## Environment Variables

Create a `.env` file with:
```env
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
# or
GEMINI_API_KEY=your_gemini_key
```

## Getting Started

1. Choose your technology stack
2. Initialize the project in this directory
3. Implement the required API endpoints
4. Configure CORS to allow requests from frontend (http://localhost:5173)
5. Set up database connections
6. Implement authentication middleware
7. Integrate AI/LLM services (OpenAI, Google Gemini, etc.)

## Integration with Frontend

The frontend is configured to make API calls to `http://localhost:3000` by default. Update the frontend's `.env` file if using a different port:

```env
VITE_API_BASE_URL=http://localhost:YOUR_PORT
```

## Documentation

For detailed API specifications and integration examples, see:
- Frontend API integration: `../frontend/src/api/README.md`
- Frontend services: `../frontend/src/services/README.md`

## Next Steps

1. Initialize your chosen backend framework
2. Set up database schema
3. Implement authentication
4. Integrate LLM service (OpenAI/Gemini)
5. Implement image analysis
6. Add conversation history persistence
7. Deploy to production
