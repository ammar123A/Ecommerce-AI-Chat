import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import axios from 'axios'
import type { User } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  _hasHydrated: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User, token: string) => void
  setHasHydrated: (state: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,

      login: async (email: string, password: string) => {
        console.log('🔐 Attempting login...', { email })
        
        try {
          const response = await axios.post(`${API_URL}/api/auth/login`, {
            email,
            password,
          })
          
          console.log('✅ Login successful:', response.data)
          
          const { user, token } = response.data
          set({ user, token, isAuthenticated: true })
        } catch (error) {
          console.error('❌ Login failed:', error)
          throw error
        }
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
      },

      setUser: (user: User, token: string) => {
        set({ user, token, isAuthenticated: true })
      },

      setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
