# AI Chatbot Dashboard for eCommerce Support

A full-stack customer support platform with AI-assisted responses, human-in-the-loop controls, and comprehensive analytics.

## 🎯 Problem Statement

E-commerce companies face:
- **Repetitive customer questions** consuming support team time
- **Slow response times** leading to poor customer satisfaction
- **Lack of insights** into support performance and common issues

## 💡 Solution

An intelligent support dashboard that:
- **Reduces support workload** with AI-assisted responses trained on merchant FAQs
- **Improves response quality** through human oversight and editing
- **Provides actionable analytics** for support managers
- **Enables data-driven decisions** through transcript analysis and metrics

## 🏗️ Architecture

```
┌─────────────────┐
│   React Frontend│
│  (TypeScript)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────┐
│  Node.js Backend│────▶│  PostgreSQL  │
│  (TypeScript)   │     │   Database   │
│  REST + WS      │     └──────────────┘
└────────┬────────┘
         │                ┌──────────────┐
         │               │    Redis     │
         │               │(Optional)    │
         │               └──────────────┘
         ▼
┌─────────────────┐
│  Python AI      │
│  Service        │
│  (FastAPI)      │
└─────────────────┘
```

## 🛠️ Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** for build tooling
- **TailwindCSS** for styling
- **React Query** for data fetching
- **Socket.io Client** for real-time chat
- **Recharts** for analytics visualization

### Backend
- **Node.js** with **TypeScript**
- **Express.js** for REST API
- **Socket.io** for WebSocket connections
- **JWT** authentication
- **Prisma** ORM for database access

### AI Service
- **Python 3.11+**
- **FastAPI** for API framework
- **OpenAI API** for embeddings and completions
- **LangChain** for RAG implementation
- **PostgreSQL** with pgvector for embeddings

### Database & Cache
- **PostgreSQL** for persistent data
- **Redis** (optional) for session management and caching

## ✨ Key Features

### 1. FAQ Training (RAG-based)
- Upload merchant FAQs and knowledge base
- Convert to embeddings using OpenAI
- Retrieve relevant context for customer queries
- Grounded AI responses to reduce hallucinations

### 2. Human-in-the-Loop Chat
- AI suggests responses in real-time
- Support agents can:
  - Edit suggested responses
  - Approve and send
  - Reject and write manually
  - Take over conversation anytime
- Full conversation history and context

### 3. Analytics Dashboard
- **AI Performance Metrics:**
  - Answer confidence scores
  - Auto-resolution rate
  - Manual intervention rate
- **Support Metrics:**
  - Average response time
  - Customer satisfaction
  - Sentiment analysis trends
- **Operational Insights:**
  - Peak hours
  - Common topics
  - Escalation patterns

### 4. Transcript Management
- Export conversations as PDF/CSV
- Filter by date, sentiment, agent, status
- Search across all conversations
- Tag and categorize chats

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- PostgreSQL 14+
- Redis (optional but recommended)
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd AI_Chat_Dashboard
```

2. **Set up environment variables**
```bash
# Copy example env files
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
cp ai-service/.env.example ai-service/.env
```

3. **Start with Docker (Recommended)**
```bash
docker-compose up -d
```

4. **Or run services individually**

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**AI Service:**
```bash
cd ai-service
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Database:**
```bash
cd backend
npx prisma migrate dev
npx prisma db seed
```

## 📁 Project Structure

```
AI_Chat_Dashboard/
├── frontend/                # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API clients
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Node.js backend
│   ├── src/
│   │   ├── routes/         # API routes
│   │   ├── controllers/    # Route controllers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Express middleware
│   │   ├── websocket/      # Socket.io handlers
│   │   └── prisma/         # Database schema
│   └── package.json
├── ai-service/              # Python AI service
│   ├── app/
│   │   ├── services/       # AI logic
│   │   ├── models/         # Data models
│   │   ├── routes/         # API routes
│   │   └── utils/          # Utilities
│   └── requirements.txt
└── docker-compose.yml       # Container orchestration
```

## 🎤 Interview Talking Points

### Technical Decisions
- **"Used RAG to ground AI responses in merchant data, reducing hallucinations"**
- **"Separated AI service for scalability and technology flexibility"**
- **"Implemented WebSocket for real-time agent-customer communication"**
- **"Used Redis to manage conversation state and reduce AI API calls"**

### System Design
- **"Designed for human-in-the-loop to ensure quality and handle edge cases"**
- **"Analytics focused on operational insights, not vanity metrics"**
- **"Modular architecture allows independent scaling of services"**

### Business Value
- **"Reduces support costs while maintaining quality through AI assistance"**
- **"Provides managers with data to improve support operations"**
- **"Enables consistent responses across support team"**

## 🔐 Security Considerations

- JWT-based authentication
- Rate limiting on AI endpoints
- Input validation and sanitization
- SQL injection prevention with Prisma
- CORS configuration
- Environment variable protection

## 📈 Future Enhancements

- Multi-merchant/SaaS mode with tenant isolation
- Role-based access control (Admin, Manager, Agent)
- Feedback loop (thumbs up/down to improve AI)
- SLA tracking and alerts
- Integration webhooks (Shopify, WooCommerce)
- Multi-language support
- Voice chat integration

## 📝 License

MIT

## 🤝 Contributing

This is a portfolio project. Feedback and suggestions are welcome!

---

**Built by:** [Your Name]  
**Purpose:** Full-stack portfolio demonstration  
**Focus:** Real-world business value + modern architecture
