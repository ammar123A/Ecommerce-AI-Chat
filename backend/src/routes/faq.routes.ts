import { Router } from 'express'
import { authenticate } from '../middleware/auth.js'

const router = Router()

router.use(authenticate)

// Get all FAQs
router.get('/', async (req, res) => {
  res.json([])
})

// Create FAQ
router.post('/', async (req, res) => {
  res.status(201).json({ id: 'new-faq' })
})

// Update FAQ
router.put('/:id', async (req, res) => {
  res.json({ success: true })
})

// Delete FAQ
router.delete('/:id', async (req, res) => {
  res.json({ success: true })
})

// Upload FAQs (bulk)
router.post('/upload', async (req, res) => {
  res.json({ imported: 0 })
})

export default router
