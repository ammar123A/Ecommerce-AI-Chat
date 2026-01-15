import { Router } from 'express'
import { z } from 'zod'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { prisma } from '../utils/prisma.js'

const router = Router()

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  role: z.enum(['admin', 'manager', 'agent']).default('agent'),
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = loginSchema.parse(req.body)

    // For demo purposes, accept any login
    // In production, validate against database
    const mockUser = {
      id: '1',
      email,
      name: 'Demo User',
      role: 'agent',
    }

    const token = jwt.sign(
      { ...mockUser },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    )

    res.json({
      user: mockUser,
      token,
    })
  } catch (error) {
    res.status(400).json({ error: 'Invalid credentials' })
  }
})

// Register (admin only in production)
router.post('/register', async (req, res) => {
  try {
    const data = registerSchema.parse(req.body)
    
    const hashedPassword = await bcrypt.hash(data.password, 10)

    // In production, save to database
    const user = {
      id: Math.random().toString(36).substr(2, 9),
      email: data.email,
      name: data.name,
      role: data.role,
    }

    const token = jwt.sign(
      { ...user },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' } as jwt.SignOptions
    )

    res.status(201).json({
      user,
      token,
    })
  } catch (error) {
    res.status(400).json({ error: 'Registration failed' })
  }
})

// Verify token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '')
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret')
    res.json({ user: decoded })
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
})

export default router
