import express from 'express'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import dotenv from 'dotenv'
import { logger } from './utils/logger.js'
import { errorHandler } from './middleware/errorHandler.js'
import { setupSocketHandlers } from './websocket/index.js'

// Routes
import authRoutes from './routes/auth.routes.js'
import conversationRoutes from './routes/conversation.routes.js'
import faqRoutes from './routes/faq.routes.js'
import analyticsRoutes from './routes/analytics.routes.js'
import aiRoutes from './routes/ai.routes.js'

dotenv.config()

const app = express()
const httpServer = createServer(app)

// Socket.IO setup
const io = new Server(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  },
})

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`)
  next()
})

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// API Routes
app.use('/api/auth', authRoutes)
app.use('/api/conversations', conversationRoutes)
app.use('/api/faq', faqRoutes)
app.use('/api/analytics', analyticsRoutes)
app.use('/api/ai', aiRoutes)

// Error handling
app.use(errorHandler)

// WebSocket handlers
setupSocketHandlers(io)

// Start server
const PORT = process.env.PORT || 3000

httpServer.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT}`)
  logger.info(`📊 Environment: ${process.env.NODE_ENV}`)
  logger.info(`🔌 WebSocket enabled`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully')
  httpServer.close(() => {
    logger.info('Server closed')
    process.exit(0)
  })
})

export { app, io }
