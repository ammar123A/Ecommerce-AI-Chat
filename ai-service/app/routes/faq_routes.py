from fastapi import APIRouter, HTTPException
from typing import List
from app.models.schemas import FAQEmbedding
from app.services.embedding_service import EmbeddingService
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

embedding_service = EmbeddingService()

@router.post("/embed")
async def embed_faqs(faqs: List[FAQEmbedding]):
    """
    Generate and store embeddings for FAQs.
    This should be called when FAQs are created or updated.
    """
    try:
        result = await embedding_service.embed_faqs(faqs)
        return {
            "success": True,
            "embedded_count": result["count"],
            "message": f"Successfully embedded {result['count']} FAQs"
        }
    except Exception as e:
        logger.error(f"Error embedding FAQs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/search")
async def search_faqs(query: str, limit: int = 5):
    """
    Search FAQs using semantic similarity.
    Returns most relevant FAQs for the given query.
    """
    try:
        results = await embedding_service.search_similar_faqs(query, limit)
        return {
            "query": query,
            "results": results
        }
    except Exception as e:
        logger.error(f"Error searching FAQs: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
