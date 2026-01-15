import { Server, Socket } from 'socket.io'
import jwt from 'jsonwebtoken'
import { logger } from '../utils/logger.js'

interface AuthSocket extends Socket {
  user?: any
}

export const setupSocketHandlers = (io: Server) => {
  // Authentication middleware
  io.use((socket: AuthSocket, next) => {
    const token = socket.handshake.auth.token

    if (!token) {
      return next(new Error('Authentication error'))
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
      socket.user = decoded
      next()
    } catch (err) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket: AuthSocket) => {
    logger.info(`User connected: ${socket.user?.email}`)

    // Join conversation room
    socket.on('join_conversation', ({ conversationId }) => {
      socket.join(`conversation:${conversationId}`)
      logger.info(`User ${socket.user?.email} joined conversation ${conversationId}`)
    })

    // Leave conversation room
    socket.on('leave_conversation', ({ conversationId }) => {
      socket.leave(`conversation:${conversationId}`)
      logger.info(`User ${socket.user?.email} left conversation ${conversationId}`)
    })

    // Send message
    socket.on('send_message', async ({ conversationId, content }) => {
      const message = {
        id: Math.random().toString(36).substr(2, 9),
        conversationId,
        content,
        sender: 'agent',
        timestamp: new Date().toISOString(),
      }

      // Broadcast to conversation room
      io.to(`conversation:${conversationId}`).emit('new_message', message)
      
      logger.info(`Message sent in conversation ${conversationId}`)
    })

    // Request AI suggestion
    socket.on('request_ai_suggestion', async ({ conversationId, userMessage }) => {
      // Call AI service (placeholder)
      // In production, call the Python AI service
      const suggestion = {
        message: 'AI-generated response based on FAQs',
        confidence: 0.92,
        sources: [],
      }

      socket.emit('ai_suggestion', {
        conversationId,
        suggestion,
      })

      logger.info(`AI suggestion requested for conversation ${conversationId}`)
    })

    // Approve AI suggestion
    socket.on('approve_ai_suggestion', ({ conversationId, suggestionId }) => {
      logger.info(`AI suggestion approved: ${suggestionId}`)
    })

    // Reject AI suggestion
    socket.on('reject_ai_suggestion', ({ conversationId, suggestionId }) => {
      logger.info(`AI suggestion rejected: ${suggestionId}`)
    })

    // Typing indicator
    socket.on('typing', ({ conversationId, isTyping }) => {
      socket.to(`conversation:${conversationId}`).emit('typing', {
        user: socket.user?.name,
        isTyping,
      })
    })

    // Disconnect
    socket.on('disconnect', () => {
      logger.info(`User disconnected: ${socket.user?.email}`)
    })
  })
}
