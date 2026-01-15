import openai
from typing import List, Dict
from app.config import settings
from app.models.schemas import AISuggestionResponse, FAQSource, SentimentAnalysisResponse
from app.services.embedding_service import EmbeddingService
import logging

logger = logging.getLogger(__name__)

class AIService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.model = settings.OPENAI_MODEL
        self.temperature = settings.TEMPERATURE
        self.embedding_service = EmbeddingService()
        
    async def generate_suggestion(
        self,
        user_message: str,
        conversation_history: List[Dict],
        conversation_id: str
    ) -> AISuggestionResponse:
        """
        Generate AI response suggestion using RAG approach.
        1. Retrieve relevant FAQs using semantic search
        2. Construct prompt with context
        3. Generate response using OpenAI
        """
        try:
            # Step 1: Retrieve relevant FAQs
            relevant_faqs = await self.embedding_service.search_similar_faqs(
                user_message,
                limit=settings.TOP_K_FAQS
            )
            
            # Step 2: Build context from FAQs
            context = self._build_context(relevant_faqs)
            
            # Step 3: Build conversation context
            conversation_context = self._build_conversation_context(conversation_history)
            
            # Step 4: Generate response
            prompt = self._build_prompt(user_message, context, conversation_context)
            
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful customer support assistant. Use the provided FAQ context to answer customer questions accurately and professionally. If the FAQs don't contain relevant information, politely say you'll need to check with a team member."
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=self.temperature,
                max_tokens=500
            )
            
            suggested_message = response.choices[0].message.content
            
            # Calculate confidence based on FAQ relevance
            confidence = self._calculate_confidence(relevant_faqs)
            
            # Build sources list
            sources = [
                FAQSource(
                    faq_id=faq["id"],
                    question=faq["question"],
                    answer=faq["answer"],
                    relevance=faq["similarity"]
                )
                for faq in relevant_faqs[:3]  # Top 3 sources
            ]
            
            return AISuggestionResponse(
                message=suggested_message,
                confidence=confidence,
                sources=sources,
                reasoning=f"Based on {len(relevant_faqs)} relevant FAQs"
            )
            
        except Exception as e:
            logger.error(f"Error in generate_suggestion: {str(e)}")
            # Return low-confidence fallback
            return AISuggestionResponse(
                message="I apologize, but I need to transfer you to a human agent for better assistance.",
                confidence=0.0,
                sources=[],
                reasoning="Error occurred during generation"
            )
    
    async def analyze_sentiment(self, text: str) -> SentimentAnalysisResponse:
        """
        Analyze sentiment of customer message.
        """
        try:
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "Analyze the sentiment of the following customer message. Respond with only one word: positive, neutral, or negative."
                    },
                    {
                        "role": "user",
                        "content": text
                    }
                ],
                temperature=0.3,
                max_tokens=10
            )
            
            sentiment = response.choices[0].message.content.strip().lower()
            
            # Validate sentiment
            if sentiment not in ["positive", "neutral", "negative"]:
                sentiment = "neutral"
            
            return SentimentAnalysisResponse(
                sentiment=sentiment,
                confidence=0.85  # Placeholder; could be improved
            )
            
        except Exception as e:
            logger.error(f"Error in analyze_sentiment: {str(e)}")
            return SentimentAnalysisResponse(
                sentiment="neutral",
                confidence=0.0
            )
    
    def _build_context(self, faqs: List[Dict]) -> str:
        """Build context string from retrieved FAQs."""
        if not faqs:
            return "No relevant FAQs found."
        
        context_parts = []
        for i, faq in enumerate(faqs, 1):
            context_parts.append(
                f"FAQ {i}:\nQ: {faq['question']}\nA: {faq['answer']}\n"
            )
        
        return "\n".join(context_parts)
    
    def _build_conversation_context(self, history: List[Dict]) -> str:
        """Build conversation history context."""
        if not history:
            return ""
        
        context_parts = []
        for msg in history[-5:]:  # Last 5 messages
            sender = msg.get("sender", "user")
            content = msg.get("content", "")
            context_parts.append(f"{sender}: {content}")
        
        return "\n".join(context_parts)
    
    def _build_prompt(self, user_message: str, faq_context: str, conversation_context: str) -> str:
        """Build the final prompt for OpenAI."""
        prompt = f"""Relevant FAQs:
{faq_context}

"""
        
        if conversation_context:
            prompt += f"""Previous conversation:
{conversation_context}

"""
        
        prompt += f"""Current customer message:
{user_message}

Based on the FAQs and conversation context, provide a helpful response to the customer."""
        
        return prompt
    
    def _calculate_confidence(self, faqs: List[Dict]) -> float:
        """Calculate confidence score based on FAQ relevance."""
        if not faqs:
            return 0.0
        
        # Use the highest similarity score as confidence
        max_similarity = max(faq.get("similarity", 0.0) for faq in faqs)
        
        # Normalize to 0-1 range and apply threshold
        confidence = min(max_similarity, 1.0)
        
        return round(confidence, 2)
