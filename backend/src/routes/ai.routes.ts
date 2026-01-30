import { Router } from 'express'
import axios from 'axios'
import { logger } from '../utils/logger.js'
import { authenticate } from '../middleware/auth.js'

const router = Router()

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000'

// Get AI suggestion
router.post('/suggest', authenticate, async (req, res) => {
  try {
    const { conversationId, messages } = req.body

    logger.info(`AI suggestion requested for conversation ${conversationId}`)

    // Get the last user message
    const lastUserMessage = messages && messages.length > 0 
      ? messages[messages.length - 1]?.content || ''
      : ''

    // Forward request to AI service with correct format
    const response = await axios.post(`${AI_SERVICE_URL}/api/ai/suggest`, {
      conversation_id: conversationId,
      user_message: lastUserMessage,
      conversation_history: messages || [],
    })

    res.json({
      suggestion: response.data.message,
      confidence: response.data.confidence,
    })
  } catch (error: any) {
    logger.error('AI suggestion error:', error.message)
    if (error.response) {
      logger.error('AI service response:', error.response.data)
    }
    res.status(500).json({
      error: 'Failed to get AI suggestion',
      message: error.message,
    })
  }
})

export default router
