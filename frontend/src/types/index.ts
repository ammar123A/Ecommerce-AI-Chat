export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'manager' | 'agent'
  createdAt: string
}

export interface Message {
  id: string
  conversationId: string
  content: string
  sender: 'customer' | 'agent' | 'ai'
  timestamp: string
  aiSuggestion?: string
  aiConfidence?: number
  edited?: boolean
}

export interface Conversation {
  id: string
  customerId: string
  customerName: string
  customerEmail: string
  agentId?: string
  agentName?: string
  status: 'active' | 'resolved' | 'escalated'
  sentiment: 'positive' | 'neutral' | 'negative'
  messages: Message[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  tags: string[]
  embedding?: number[]
  createdAt: string
  updatedAt: string
}

export interface AnalyticsData {
  totalConversations: number
  activeConversations: number
  avgResponseTime: number
  autoResolutionRate: number
  customerSatisfaction: number
  aiAccuracy: number
  sentimentDistribution: {
    positive: number
    neutral: number
    negative: number
  }
  topCategories: Array<{
    category: string
    count: number
  }>
  performanceOverTime: Array<{
    date: string
    conversations: number
    resolved: number
    avgResponseTime: number
  }>
}

export interface AISuggestion {
  message: string
  confidence: number
  sources: Array<{
    faqId: string
    question: string
    relevance: number
  }>
}
