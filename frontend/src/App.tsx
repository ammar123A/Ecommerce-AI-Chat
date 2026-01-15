import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import ChatPage from './pages/ChatPage'
import AnalyticsPage from './pages/AnalyticsPage'
import FAQManagementPage from './pages/FAQManagementPage'
import TranscriptsPage from './pages/TranscriptsPage'
import SettingsPage from './pages/SettingsPage'

function App() {
  const { token, user, _hasHydrated } = useAuthStore()
  
  // Wait for Zustand to rehydrate from localStorage
  if (!_hasHydrated) {
    console.log('⏳ App.tsx - Waiting for auth state to hydrate...')
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const isAuthenticated = !!token
  
  console.log('🔍 App.tsx - Auth Debug:', {
    hasToken: !!token,
    token: token?.substring(0, 20) + '...',
    user: user?.email,
    isAuthenticated,
    _hasHydrated
  })

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      
      <Route
        path="/"
        element={
          isAuthenticated ? <Layout /> : <Navigate to="/login" replace />
        }
      >
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="chat" element={<ChatPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="faq" element={<FAQManagementPage />} />
        <Route path="transcripts" element={<TranscriptsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
