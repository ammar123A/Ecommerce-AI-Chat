import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const apiClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const authStorage = localStorage.getItem('auth-storage')
    console.log('🔍 API Interceptor - Request:', {
      url: config.url,
      method: config.method,
      hasAuthStorage: !!authStorage
    })
    
    if (authStorage) {
      const { state } = JSON.parse(authStorage)
      console.log('🔍 API Interceptor - Auth State:', {
        hasToken: !!state?.token,
        hasUser: !!state?.user,
        tokenPreview: state?.token?.substring(0, 20) + '...'
      })
      
      if (state?.token) {
        config.headers.Authorization = `Bearer ${state.token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', {
      url: response.config.url,
      status: response.status
    })
    return response
  },
  (error) => {
    console.error('❌ API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    })
    
    // Only redirect to login if we get a 401 AND the request was authenticated
    // This prevents redirect loops and false redirects
    if (error.response?.status === 401 && error.config?.headers?.Authorization) {
      console.error('🚨 401 Unauthorized with auth token - token may be invalid')
      console.error('🚨 NOT redirecting - staying on current page to debug')
      // Temporarily disabled redirect for debugging
      // localStorage.removeItem('auth-storage')
      // window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
