import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'
import { prisma } from '../utils/prisma.js'

const router = Router()

router.use(authenticate)

// Get all conversations
router.get('/', async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      include: {
        customer: true,
        agent: true,
        messages: {
          orderBy: {
            timestamp: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Format response to match frontend types
    const formattedConversations = conversations.map(conv => ({
      id: conv.id,
      customerId: conv.customerId,
      customerName: conv.customer.name,
      customerEmail: conv.customer.email,
      agentId: conv.agentId,
      agentName: conv.agent?.name,
      status: conv.status.toLowerCase(),
      sentiment: conv.sentiment.toLowerCase(),
      messages: conv.messages,
      createdAt: conv.createdAt.toISOString(),
      updatedAt: conv.updatedAt.toISOString(),
      resolvedAt: conv.resolvedAt?.toISOString()
    }))

    res.json(formattedConversations)
  } catch (error) {
    console.error('Error fetching conversations:', error)
    res.status(500).json({ error: 'Failed to fetch conversations' })
  }
})

// Get single conversation with all messages
router.get('/:id', async (req, res) => {
  try {
    const conversation = await prisma.conversation.findUnique({
      where: { id: req.params.id },
      include: {
        customer: true,
        agent: true,
        messages: {
          orderBy: {
            timestamp: 'asc'
          },
          include: {
            agent: true
          }
        }
      }
    })

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    res.json(conversation)
  } catch (error) {
    console.error('Error fetching conversation:', error)
    res.status(500).json({ error: 'Failed to fetch conversation' })
  }
})

// Get messages for a conversation
router.get('/:id/messages', async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      include: {
        agent: true
      },
      orderBy: {
        timestamp: 'asc'
      }
    })

    // Format messages to match frontend types
    const formattedMessages = messages.map(msg => ({
      id: msg.id,
      conversationId: msg.conversationId,
      content: msg.content,
      sender: msg.sender.toLowerCase(),
      timestamp: msg.timestamp.toISOString(),
      aiSuggestion: msg.aiSuggestion,
      aiConfidence: msg.aiConfidence,
      edited: msg.edited
    }))

    res.json(formattedMessages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    res.status(500).json({ error: 'Failed to fetch messages' })
  }
})

// Create new message in conversation
router.post('/:id/messages', async (req, res) => {
  try {
    const { content, sender } = req.body
    const user = (req as any).user

    const message = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        content,
        sender: sender.toUpperCase(),
        agentId: sender.toLowerCase() === 'agent' ? user.id : null,
        timestamp: new Date()
      }
    })

    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() }
    })

    res.status(201).json(message)
  } catch (error) {
    console.error('Error creating message:', error)
    res.status(500).json({ error: 'Failed to create message' })
  }
})

// Create conversation
router.post('/', async (req, res) => {
  try {
    const { customerId } = req.body
    const user = (req as any).user

    const conversation = await prisma.conversation.create({
      data: {
        customerId,
        agentId: user.id,
        status: 'ACTIVE',
        sentiment: 'NEUTRAL'
      },
      include: {
        customer: true,
        agent: true
      }
    })

    res.status(201).json(conversation)
  } catch (error) {
    console.error('Error creating conversation:', error)
    res.status(500).json({ error: 'Failed to create conversation' })
  }
})

// Update conversation status
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body

    const conversation = await prisma.conversation.update({
      where: { id: req.params.id },
      data: {
        status: status.toUpperCase(),
        resolvedAt: status.toLowerCase() === 'resolved' ? new Date() : null
      }
    })

    res.json(conversation)
  } catch (error) {
    console.error('Error updating conversation:', error)
    res.status(500).json({ error: 'Failed to update conversation' })
  }
})

export default router
