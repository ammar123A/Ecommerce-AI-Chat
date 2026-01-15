import { io, Socket } from 'socket.io-client'

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000'

class SocketService {
  private socket: Socket | null = null

  connect(token: string) {
    if (this.socket?.connected) return this.socket

    this.socket = io(WS_URL, {
      auth: { token },
      transports: ['websocket'],
    })

    this.socket.on('connect', () => {
      console.log('WebSocket connected')
    })

    this.socket.on('disconnect', () => {
      console.log('WebSocket disconnected')
    })

    this.socket.on('error', (error) => {
      console.error('WebSocket error:', error)
    })

    return this.socket
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket() {
    return this.socket
  }

  // Chat events
  joinConversation(conversationId: string) {
    this.socket?.emit('join_conversation', { conversationId })
  }

  leaveConversation(conversationId: string) {
    this.socket?.emit('leave_conversation', { conversationId })
  }

  sendMessage(conversationId: string, content: string) {
    this.socket?.emit('send_message', { conversationId, content })
  }

  requestAISuggestion(conversationId: string, userMessage: string) {
    this.socket?.emit('request_ai_suggestion', { conversationId, userMessage })
  }

  approveAISuggestion(conversationId: string, suggestionId: string) {
    this.socket?.emit('approve_ai_suggestion', { conversationId, suggestionId })
  }

  rejectAISuggestion(conversationId: string, suggestionId: string) {
    this.socket?.emit('reject_ai_suggestion', { conversationId, suggestionId })
  }

  // Event listeners
  onNewMessage(callback: (data: any) => void) {
    this.socket?.on('new_message', callback)
  }

  onAISuggestion(callback: (data: any) => void) {
    this.socket?.on('ai_suggestion', callback)
  }

  onTyping(callback: (data: any) => void) {
    this.socket?.on('typing', callback)
  }

  onConversationUpdate(callback: (data: any) => void) {
    this.socket?.on('conversation_update', callback)
  }

  // Remove listeners
  off(event: string, callback?: any) {
    this.socket?.off(event, callback)
  }
}

export const socketService = new SocketService()
