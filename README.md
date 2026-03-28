# AgriHelp - Agricultural AI Assistant

<br>

An intelligent agricultural assistant that helps farmers diagnose crop diseases, get farming advice, and receive treatment recommendations in multiple languages (Darija, Arabic, French).

## 📁 Project Structure

```
agrihelp_app/
├── frontend/              # React/TypeScript web application
├── backend/               # Backend API (to be implemented)
├── docs/                  # Documentation and assets
│   └── images/           # Project images
└── README.md             # This file
```

## ✨ Features

**Core Functionality**
- 🌾 AI-powered agricultural advice and crop disease diagnosis
- 📸 Image analysis for disease detection
- 💊 Automated treatment recommendations
- 💬 Conversation history and persistent chat sessions

**User Experience**
- 📱 Mobile-first responsive design
- 🌍 Multi-language support (Darija, Arabic, French)
- 🔐 Secure authentication system
- 🎨 Modern UI built with shadcn/ui and Tailwind CSS

## 🚀 Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`

For detailed frontend documentation, see [frontend/README.md](frontend/README.md)

### Backend

The backend is not yet implemented. See [backend/README.md](backend/README.md) for:
- Required API endpoints
- Technology stack recommendations
- Integration guide with frontend

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Routing**: React Router v6
- **State Management**: TanStack Query

### Backend (Planned)
- Choose from: Node.js/Express, Python/FastAPI, or Java/Spring Boot
- Database: PostgreSQL or MongoDB
- AI/LLM: OpenAI GPT or Google Gemini
- Authentication: JWT or OAuth

## 📱 Application Routes

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Homepage with features |
| `/signin` | Sign In | User authentication |
| `/signup` | Sign Up | User registration |
| `/chat` | Chat | AI assistant interface |

## 🔌 Backend Integration

The frontend is ready to integrate with a backend API. Required endpoints:

**Chat & LLM**
```
POST /api/llm/chat      # Send message to AI
POST /api/llm/stream    # Stream AI responses
```

**Image Analysis**
```
POST /api/image/upload           # Upload image
POST /api/image/analyze          # Analyze for diseases
POST /api/image/analyze-base64   # Analyze base64 image
```

**Authentication**
```
POST /api/auth/signin    # User login
POST /api/auth/signup    # User registration
POST /api/auth/signout   # User logout
POST /api/auth/refresh   # Refresh token
```

See [backend/README.md](backend/README.md) for implementation details.

## 🌍 Multi-Language Support

Supports three languages with RTL for Arabic:
- **Darija** (Moroccan Arabic)
- **Arabic** (Modern Standard Arabic)
- **French**

Language affects UI text, AI responses, and treatment recommendations.

## 🎨 Design System

**Colors**
- Primary: Deep Olive Green `hsl(140 30% 28%)`
- Accent: Wheat Gold `hsl(42 85% 55%)`
- Background: Green-to-teal gradient

**Typography**
- Latin: Nunito
- Arabic: IBM Plex Sans Arabic

**Mobile-First Principles**
- Minimum touch target: 44×44px
- Responsive scales: `text-base sm:text-lg md:text-xl`
- Mobile-first CSS utilities

## 🚢 Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel/Netlify
```

### Backend
See [backend/README.md](backend/README.md) for deployment instructions once implemented.

## 📋 Development Guidelines

**Code Style**
- Use TypeScript for all new code
- Functional components with hooks
- Implement proper error handling
- Follow mobile-first CSS patterns

**Component Best Practices**
- Keep components focused and small
- Extract reusable logic into hooks
- Use composition over inheritance
- Maintain consistent naming (PascalCase for components)

## 🎯 Roadmap

**Phase 1 - Backend Implementation**
- [ ] Choose and set up backend framework
- [ ] Implement authentication system
- [ ] Connect LLM API (OpenAI/Gemini)
- [ ] Integrate image analysis service

**Phase 2 - Enhanced Features**
- [ ] Conversation history persistence
- [ ] Offline support & PWA
- [ ] Push notifications
- [ ] Real-time chat updates

**Phase 3 - Scale & Analytics**
- [ ] Admin dashboard
- [ ] Analytics and monitoring
- [ ] Multi-region support
- [ ] Performance optimization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📖 **Frontend Documentation**: [frontend/README.md](frontend/README.md)
- 🔧 **Backend Documentation**: [backend/README.md](backend/README.md)
- 🐛 **Issues**: Open an issue on GitHub
- 💬 **Questions**: Contact the development team
