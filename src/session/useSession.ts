import { useCallback, useEffect } from 'react'
import {
  useSessionStore,
  useUser,
  useIsAuthenticated,
  useIsLoading,
  useStoredAccessToken,
} from './sessionStore'
import { apiClient, setAccessToken } from '@api/apiClient'
import { User } from '@/types'
import { env } from '@config/env'

export function useSession() {
  const user = useUser()
  const accessToken = useStoredAccessToken()
  const isAuthenticated = useIsAuthenticated()
  const isLoading = useIsLoading()
  const { setUser, setAuthenticated, setLoading, logout } = useSessionStore()

  const validateSession = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.get<User>('/auth/me')
      setUser(response.data)
      setAuthenticated(true)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }, [logout, setAuthenticated, setLoading, setUser])

  const refresh = useCallback(async () => {
    try {
      const response = await apiClient.post<{ accessToken: string; user: User }>('/auth/refresh')
      setUser(response.data.user)
      setAuthenticated(true)
      return response.data
    } catch {
      logout()
      throw new Error('Session refresh failed')
    }
  }, [logout, setAuthenticated, setUser])

  useEffect(() => {
    if (!isLoading) {
      return
    }

    if (accessToken && user) {
      setAccessToken(accessToken)
      setAuthenticated(true)
      setLoading(false)
      return
    }

    if (env.ENABLE_MOCKS || !accessToken) {
      setAuthenticated(false)
      setLoading(false)
      return
    }

    validateSession()
  }, [accessToken, isLoading, setAuthenticated, setLoading, user, validateSession])

  return {
    user,
    isAuthenticated,
    isLoading,
    logout,
    refresh,
    validateSession,
  }
}
