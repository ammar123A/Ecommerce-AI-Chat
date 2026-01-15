from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.config import settings
from app.routes import ai_routes, faq_routes

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("🚀 AI Service starting...")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"OpenAI Model: {settings.OPENAI_MODEL}")
    yield
    # Shutdown
    logger.info("AI Service shutting down...")

app = FastAPI(
    title="eCommerce Support AI Service",
    description="AI-powered customer support assistance with RAG",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure properly in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check
@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "service": "ai-service",
        "model": settings.OPENAI_MODEL
    }

# Routes
app.include_router(ai_routes.router, prefix="/api/ai", tags=["AI"])
app.include_router(faq_routes.router, prefix="/api/faq", tags=["FAQ"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
