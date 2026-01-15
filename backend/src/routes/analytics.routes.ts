import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

// Get dashboard analytics
router.get('/dashboard', async (req, res) => {
  res.json({
    totalConversations: 0,
    activeConversations: 0,
    avgResponseTime: 0,
    autoResolutionRate: 0,
    customerSatisfaction: 0,
    aiAccuracy: 0,
  })
})

// Get detailed analytics
router.get('/detailed', async (req, res) => {
  res.json({
    sentimentDistribution: { positive: 0, neutral: 0, negative: 0 },
    topCategories: [],
    performanceOverTime: [],
  })
})

export default router
