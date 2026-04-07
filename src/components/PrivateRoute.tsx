import { Navigate, useLocation } from 'react-router-dom'
import { useSessionStore } from '@session/sessionStore'
import { ReactNode } from 'react'
import { useSession } from '@session/useSession'

interface PrivateRouteProps {
  children: ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  useSession()

  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const isLoading = useSessionStore((state) => state.isLoading)
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
