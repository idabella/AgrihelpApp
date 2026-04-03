# AgriHelp Backend

A **Python / FastAPI** backend powering the AgriHelp agricultural AI assistant.

## Features

- 🌾 **Multilingual AI Chat** — Darija, French, and Arabic via Google Gemini
- 🔬 **Crop Disease Detection** — Image analysis with Gemini Vision API
- 🔐 **Authentication** — Supabase-backed sign-in, sign-up, token refresh
- 📡 **SSE Streaming** — Real-time streamed AI responses
- 📁 **Image Upload** — Multipart upload with size/type validation
- 📄 **Interactive Docs** — Auto-generated Swagger UI at `/docs`

---

## Project Structure

```
backend/
├── main.py                  # FastAPI app entry point
├── config.py                # Settings (reads from .env)
├── requirements.txt         # Python dependencies
├── .env.example             # Environment variable template
│
├── routers/
│   ├── llm.py               # POST /api/llm/chat, /api/llm/stream
│   ├── image.py             # POST /api/image/upload|analyze|analyze-base64
│   └── auth.py              # POST /api/auth/signin|signup|signout|refresh
│
├── services/
│   ├── llm_service.py       # Gemini Pro chat + streaming
│   ├── image_service.py     # Gemini Vision disease detection
│   └── auth_service.py      # Supabase auth wrapper
│
├── models/
│   └── schemas.py           # Pydantic request/response models
│
└── utils/
    └── helpers.py           # Shared utility functions
```

---

## Quick Start

### 1. Prerequisites

- Python 3.11+
- A [Google AI Studio](https://aistudio.google.com/) API key (Gemini)
- A [Supabase](https://supabase.com/) project

### 2. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

| Variable | Description |
|----------|-------------|
| `GEMINI_API_KEY` | Google AI Studio API key |
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |
| `PORT` | Server port (default: `3000`) |
| `ALLOWED_ORIGINS` | Comma-separated CORS origins |

### 5. Run the Server

```bash
# Development (auto-reload)
uvicorn main:app --reload --port 3000

# Or use the built-in runner
python main.py
```

The API will be available at: **http://localhost:3000**  
Interactive docs: **http://localhost:3000/docs**

---

## API Reference

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Check API status and service config |
| `GET` | `/` | Welcome message |

### LLM Chat

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/llm/chat` | Send message, get full response |
| `POST` | `/api/llm/stream` | Send message, receive SSE stream |

**Request body (`/api/llm/chat`):**
```json
{
  "message": "What is causing my tomato leaves to turn yellow?",
  "language": "french",
  "imageUrl": "https://...",
  "conversationHistory": [
    { "role": "user", "content": "..." },
    { "role": "assistant", "content": "..." }
  ]
}
```

**Response:**
```json
{
  "response": "The yellowing could indicate...",
  "confidence": 0.85,
  "sources": []
}
```

### Image Analysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/image/upload` | Upload image file (returns URL) |
| `POST` | `/api/image/analyze` | Analyze image from URL |
| `POST` | `/api/image/analyze-base64` | Analyze base64-encoded image |

**Response:**
```json
{
  "success": true,
  "detections": [
    {
      "diseaseName": "Early Blight",
      "confidence": 0.91,
      "severity": "medium",
      "affectedArea": 35
    }
  ],
  "diagnosis": "Early blight caused by Alternaria solani...",
  "treatment": {
    "method": "Fungicide application",
    "products": ["Mancozeb", "Chlorothalonil"],
    "steps": ["Remove affected leaves", "Apply fungicide every 7 days"],
    "preventiveMeasures": ["Rotate crops annually", "Ensure proper spacing"],
    "estimatedCost": "50-100 MAD"
  }
}
```

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/signin` | Sign in with email + password |
| `POST` | `/api/auth/signup` | Register new account |
| `POST` | `/api/auth/signout` | Sign out / invalidate session |
| `POST` | `/api/auth/refresh` | Refresh access token |

---

## Environment Variables

See [`.env.example`](.env.example) for the full list of configuration options.

---

## Integration with Frontend

The frontend is pre-configured to call `http://localhost:3000` (set via `VITE_API_BASE_URL`). Start both servers:

```bash
# Terminal 1 — Backend
cd backend && uvicorn main:app --reload --port 3000

# Terminal 2 — Frontend
cd frontend && npm run dev
```
