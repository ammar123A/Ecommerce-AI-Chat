from fastapi import APIRouter, HTTPException
from app.models.schemas import (
    AISuggestionRequest, 
    AISuggestionResponse,
    SentimentAnalysisRequest,
    SentimentAnalysisResponse
)
from app.services.ai_service import AIService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

ai_service = AIService()

@router.post("/suggest", response_model=AISuggestionResponse)
async def generate_suggestion(request: AISuggestionRequest):
    """
    Generate AI-powered response suggestion based on user message and conversation history.
    Uses RAG to retrieve relevant FAQs and generate contextual response.
    """
    try:
        suggestion = await ai_service.generate_suggestion(
            user_message=request.user_message,
            conversation_history=request.conversation_history,
            conversation_id=request.conversation_id
        )
        return suggestion
    except Exception as e:
        logger.error(f"Error generating suggestion: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/sentiment", response_model=SentimentAnalysisResponse)
async def analyze_sentiment(request: SentimentAnalysisRequest):
    """
    Analyze sentiment of given text.
    Returns sentiment (positive/neutral/negative) and confidence score.
    """
    try:
        result = await ai_service.analyze_sentiment(request.text)
        return result
    except Exception as e:
        logger.error(f"Error analyzing sentiment: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
