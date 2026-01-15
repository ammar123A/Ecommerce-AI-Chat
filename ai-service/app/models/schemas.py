from pydantic import BaseModel
from typing import List, Optional

class FAQSource(BaseModel):
    faq_id: str
    question: str
    answer: str
    relevance: float

class AISuggestionRequest(BaseModel):
    conversation_id: str
    user_message: str
    conversation_history: List[dict] = []

class AISuggestionResponse(BaseModel):
    message: str
    confidence: float
    sources: List[FAQSource]
    reasoning: Optional[str] = None

class FAQEmbedding(BaseModel):
    faq_id: str
    question: str
    answer: str
    category: str
    tags: List[str] = []

class SentimentAnalysisRequest(BaseModel):
    text: str

class SentimentAnalysisResponse(BaseModel):
    sentiment: str  # positive, neutral, negative
    confidence: float
