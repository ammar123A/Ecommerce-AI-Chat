# AI Chatbot Dashboard - Quick Start Guide

## 🚀 Getting Started

### Option 1: Docker (Recommended)

1. **Install Prerequisites**
   - Docker Desktop
   - OpenAI API key

2. **Set up environment variables**
   ```bash
   # Copy environment files
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   cp ai-service/.env.example ai-service/.env
   
   # Edit ai-service/.env and add your OpenAI API key
   ```

3. **Start all services**
   ```bash
   docker-compose up -d
   ```

4. **Initialize the database**
   ```bash
   docker exec -it ecommerce_support_backend npx prisma migrate dev
   docker exec -it ecommerce_support_backend npm run seed
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000
   - AI Service: http://localhost:8000

### Option 2: Manual Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev
```

#### Backend
```bash
cd backend
npm install
npx prisma generate
npx prisma migrate dev
npm run seed
npm run dev
```

#### AI Service
```bash
cd ai-service
python -m venv venv
venv\Scripts\activate  # On Windows
# source venv/bin/activate  # On Mac/Linux
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## 📝 Default Login Credentials

**Admin:**
- Email: admin@ecommerce.com
- Password: admin123

**Agent:**
- Email: agent1@ecommerce.com
- Password: agent123

**Demo Mode:**
- Use any email/password to login (authentication is mocked for development)

## 🧪 Testing the Features

### 1. FAQ Management
- Navigate to "FAQ Management"
- Sample FAQs are pre-loaded from the seed script
- Add new FAQs to train the AI

### 2. Chat Interface
- Go to "Chat" page
- The AI will suggest responses based on FAQs
- Test the human-in-the-loop workflow

### 3. Analytics Dashboard
- View metrics on the "Analytics" page
- Observe AI performance metrics
- See sentiment analysis trends

## 🔧 Development Tips

### Backend Development
- API runs on port 3000
- WebSocket endpoint: ws://localhost:3000
- Prisma Studio: `npx prisma studio` (view database)

### Frontend Development
- Vite dev server with HMR
- TailwindCSS for styling
- React Query for data fetching

### AI Service Development
- FastAPI with auto-reload
- Swagger docs: http://localhost:8000/docs
- Test endpoints directly in the browser

## 📦 Project Structure Overview

```
AI_Chat_Dashboard/
├── frontend/          # React + TypeScript
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API & WebSocket
│   │   ├── store/        # Zustand state management
│   │   └── types/        # TypeScript definitions
│   └── package.json
├── backend/           # Node.js + Express
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Auth, error handling
│   │   ├── websocket/    # Socket.io handlers
│   │   └── prisma/       # Database schema
│   └── package.json
├── ai-service/        # Python FastAPI
│   └── app/
│       ├── routes/       # AI endpoints
│       ├── services/     # RAG logic
│       └── models/       # Data schemas
└── docker-compose.yml
```

## 🎯 Next Steps for Development

1. **Implement Real Authentication**
   - Replace mock auth with actual password verification
   - Add password reset flow
   - Implement refresh tokens

2. **Connect AI Service**
   - Link backend to AI service endpoints
   - Implement embeddings storage with pgvector
   - Add caching with Redis

3. **Build Advanced Features**
   - Multi-merchant support
   - Role-based permissions
   - Real-time analytics
   - Export functionality

4. **Add Tests**
   - Unit tests for services
   - Integration tests for APIs
   - E2E tests with Playwright

## 🐛 Troubleshooting

**Port Already in Use:**
```bash
# Stop all containers
docker-compose down

# Or change ports in docker-compose.yml
```

**Database Connection Error:**
```bash
# Reset database
docker-compose down -v
docker-compose up -d
```

**OpenAI API Errors:**
- Verify your API key in `ai-service/.env`
- Check your OpenAI account has credits
- Ensure the model name is correct

## 📚 Additional Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)

---

**Need help?** Check the main README.md for detailed architecture and feature explanations.
