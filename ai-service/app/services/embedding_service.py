import openai
import numpy as np
from typing import List, Dict
from app.config import settings
from app.models.schemas import FAQEmbedding
import logging

logger = logging.getLogger(__name__)

class EmbeddingService:
    def __init__(self):
        openai.api_key = settings.OPENAI_API_KEY
        self.embedding_model = settings.EMBEDDING_MODEL
        # In production, this would connect to a vector database
        # For now, we'll use in-memory storage as placeholder
        self.faq_embeddings: List[Dict] = []
    
    async def embed_faqs(self, faqs: List[FAQEmbedding]) -> Dict:
        """
        Generate embeddings for FAQs and store them.
        In production, this would store in PostgreSQL with pgvector.
        """
        try:
            embedded_count = 0
            
            for faq in faqs:
                # Combine question and answer for embedding
                text = f"Question: {faq.question}\nAnswer: {faq.answer}"
                
                # Generate embedding
                response = await openai.Embedding.acreate(
                    model=self.embedding_model,
                    input=text
                )
                
                embedding = response.data[0].embedding
                
                # Store embedding with metadata
                self.faq_embeddings.append({
                    "id": faq.faq_id,
                    "question": faq.question,
                    "answer": faq.answer,
                    "category": faq.category,
                    "tags": faq.tags,
                    "embedding": embedding
                })
                
                embedded_count += 1
            
            logger.info(f"Embedded {embedded_count} FAQs")
            
            return {"count": embedded_count}
            
        except Exception as e:
            logger.error(f"Error embedding FAQs: {str(e)}")
            raise
    
    async def search_similar_faqs(self, query: str, limit: int = 5) -> List[Dict]:
        """
        Search for similar FAQs using cosine similarity.
        Returns list of FAQs sorted by relevance.
        """
        try:
            # If no FAQs embedded yet, return mock data
            if not self.faq_embeddings:
                return self._get_mock_faqs()
            
            # Generate embedding for query
            response = await openai.Embedding.acreate(
                model=self.embedding_model,
                input=query
            )
            
            query_embedding = np.array(response.data[0].embedding)
            
            # Calculate similarities
            similarities = []
            for faq in self.faq_embeddings:
                faq_embedding = np.array(faq["embedding"])
                similarity = self._cosine_similarity(query_embedding, faq_embedding)
                
                similarities.append({
                    "id": faq["id"],
                    "question": faq["question"],
                    "answer": faq["answer"],
                    "category": faq["category"],
                    "tags": faq["tags"],
                    "similarity": similarity
                })
            
            # Sort by similarity and return top results
            similarities.sort(key=lambda x: x["similarity"], reverse=True)
            
            return similarities[:limit]
            
        except Exception as e:
            logger.error(f"Error searching FAQs: {str(e)}")
            return self._get_mock_faqs()
    
    def _cosine_similarity(self, vec1: np.ndarray, vec2: np.ndarray) -> float:
        """Calculate cosine similarity between two vectors."""
        dot_product = np.dot(vec1, vec2)
        norm1 = np.linalg.norm(vec1)
        norm2 = np.linalg.norm(vec2)
        
        if norm1 == 0 or norm2 == 0:
            return 0.0
        
        return float(dot_product / (norm1 * norm2))
    
    def _get_mock_faqs(self) -> List[Dict]:
        """Return mock FAQs for development."""
        return [
            {
                "id": "mock-1",
                "question": "What is your shipping policy?",
                "answer": "We offer free shipping on orders over $50. Standard shipping takes 3-5 business days.",
                "category": "Shipping",
                "tags": ["shipping", "delivery"],
                "similarity": 0.92
            },
            {
                "id": "mock-2",
                "question": "How do I return an item?",
                "answer": "You can return items within 30 days of purchase. Visit our returns portal to start the process.",
                "category": "Returns",
                "tags": ["returns", "refund"],
                "similarity": 0.85
            },
            {
                "id": "mock-3",
                "question": "Do you offer international shipping?",
                "answer": "Yes, we ship to over 50 countries. International shipping rates vary by location.",
                "category": "Shipping",
                "tags": ["shipping", "international"],
                "similarity": 0.78
            }
        ]
