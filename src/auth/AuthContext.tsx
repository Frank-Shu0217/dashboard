import { createContext, useContext, ReactNode } from 'react'
import { useAuth } from './useAuth'
import { useSession } from '@session/useSession'

type AuthContextValue = ReturnType<typeof useAuth> & ReturnType<typeof useSession>

const AuthContext = createContext<AuthContextValue | null>(null)

interface AuthProviderProps {
  children: ReactNode
}

/**
 * Auth Provider - combines useAuth and useSession
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()
  const session = useSession()

  const value: AuthContextValue = {
    ...auth,
    ...session,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/**
 * Hook to access auth context
 */
export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }
  return context
}
