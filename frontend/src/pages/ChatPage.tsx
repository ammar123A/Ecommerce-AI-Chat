import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../services/api'
import { socketService } from '../services/socket'
import { Conversation, Message } from '../types'

const ChatPage = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [aiSuggestion, setAiSuggestion] = useState<string>('')
  const queryClient = useQueryClient()

  console.log('🔍 ChatPage - Component Rendered')

  // Fetch conversations
  const { data: conversations = [], error: conversationsError, isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      console.log('🔍 ChatPage - Fetching conversations...')
      try {
        const response = await api.get('/conversations')
        console.log('✅ ChatPage - Conversations fetched:', response.data)
        return response.data
      } catch (err) {
        console.error('❌ ChatPage - Error fetching conversations:', err)
        throw err
      }
    },
    refetchInterval: 5000, // Refresh every 5 seconds
  })

  console.log('🔍 ChatPage - State:', {
    conversationsCount: conversations?.length,
    conversationsLoading,
    conversationsError: conversationsError?.message,
    selectedConversationId
  })

  // Fetch messages for selected conversation
  const { data: messages = [] } = useQuery<Message[]>({
    queryKey: ['messages', selectedConversationId],
    queryFn: async () => {
      if (!selectedConversationId) return []
      const response = await api.get(`/conversations/${selectedConversationId}/messages`)
      return response.data
    },
    enabled: !!selectedConversationId,
  })

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      await api.post(`/conversations/${selectedConversationId}/messages`, {
        content,
        sender: 'agent',
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] })
      setMessageInput('')
    },
  })

  // Request AI suggestion
  const requestAiSuggestion = async () => {
    if (!selectedConversationId) return
    
    try {
      const response = await api.post('/ai/suggest', {
        conversationId: selectedConversationId,
        messages: messages.map(m => ({
          content: m.content,
          sender: m.sender,
        })),
      })
      setAiSuggestion(response.data.suggestion)
    } catch (error) {
      console.error('Error getting AI suggestion:', error)
    }
  }

  // WebSocket listeners
  useEffect(() => {
    if (!selectedConversationId) return

    socketService.joinConversation(selectedConversationId)

    socketService.onNewMessage(() => {
      queryClient.invalidateQueries({ queryKey: ['messages', selectedConversationId] })
    })

    return () => {
      socketService.off('new_message')
    }
  }, [selectedConversationId, queryClient])

  const handleSendMessage = () => {
    if (!messageInput.trim()) return
    sendMessageMutation.mutate(messageInput)
  }

  const selectedConversation = conversations.find(c => c.id === selectedConversationId)

  // Show error state AFTER all hooks
  if (conversationsError) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Conversations</h2>
          <p className="text-gray-600 mb-4">{conversationsError.message}</p>
          <div className="text-sm text-left bg-gray-100 p-4 rounded mb-4">
            <pre className="text-xs overflow-auto">{JSON.stringify(conversationsError, null, 2)}</pre>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reload Page
          </button>
        </div>
      </div>
    )
  }

  // Show loading state AFTER all hooks
  if (conversationsLoading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading conversations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex">
      {/* Conversation List */}
      <div className="w-80 bg-white border-r">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold text-gray-800">Conversations</h2>
        </div>
        <div className="overflow-y-auto h-full">
          {conversations.length === 0 ? (
            <p className="p-4 text-gray-600 text-center">No active conversations</p>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.id}
                onClick={() => setSelectedConversationId(conversation.id)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                  selectedConversationId === conversation.id ? 'bg-blue-50' : ''
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {conversation.customerName || 'Unknown Customer'}
                    </h3>
                    <p className="text-sm text-gray-600">{conversation.customerEmail}</p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs rounded ${
                      conversation.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : conversation.status === 'resolved'
                        ? 'bg-gray-100 text-gray-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {conversation.status.toUpperCase()}
                  </span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      conversation.sentiment === 'positive'
                        ? 'bg-green-500'
                        : conversation.sentiment === 'negative'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  <span className="text-xs text-gray-500 capitalize">{conversation.sentiment}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {selectedConversation ? (
          <>
            <div className="p-4 bg-white border-b">
              <h2 className="text-lg font-semibold text-gray-800">
                {selectedConversation.customerName}
              </h2>
              <p className="text-sm text-gray-600">{selectedConversation.customerEmail}</p>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'agent' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-md rounded-lg p-3 ${
                      message.sender === 'agent'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800 border'
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                    {message.aiSuggestion && (
                      <p className="text-xs mt-1 italic opacity-80">
                        ✨ AI-assisted ({Math.round((message.aiConfidence || 0) * 100)}% confidence)
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
                <button
                  onClick={requestAiSuggestion}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  title="Get AI Suggestion"
                >
                  ✨ AI
                </button>
              </div>
            </div>

            {/* AI Suggestion Panel */}
            {aiSuggestion && (
              <div className="p-4 bg-purple-50 border-t">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 mb-1">AI Suggestion:</p>
                    <p className="text-sm text-gray-700">{aiSuggestion}</p>
                  </div>
                  <button
                    onClick={() => setMessageInput(aiSuggestion)}
                    className="ml-4 px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700"
                  >
                    Use
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center text-gray-500">
              <p className="text-lg">Select a conversation to start chatting</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatPage

