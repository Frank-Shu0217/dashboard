import { MouseEvent, useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { TopNav } from '@components/TopNav'
import { Sidebar } from '@components/Sidebar'
import { useSessionStore } from '@session/sessionStore'

const SESSION_TIMEOUT_MS = 15 * 60 * 1000
const SESSION_STORAGE_KEY = 'session-storage'
const ENABLE_SESSION_TIMEOUT_LOGS = import.meta.env.DEV

function getPersistedLastActivityAt() {
  try {
    const rawSession = sessionStorage.getItem(SESSION_STORAGE_KEY)
    if (!rawSession) {
      return null
    }

    const persistedSession = JSON.parse(rawSession) as {
      state?: { lastActivityAt?: unknown }
    }
    const persistedLastActivityAt = persistedSession.state?.lastActivityAt

    return typeof persistedLastActivityAt === 'number' ? persistedLastActivityAt : null
  } catch {
    return null
  }
}

export function AppShell() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)
  const [isSessionTimeoutOpen, setIsSessionTimeoutOpen] = useState(false)
  const navigate = useNavigate()
  const lastActivityAt = useSessionStore((state) => state.lastActivityAt)
  const logout = useSessionStore((state) => state.logout)
  const touchActivity = useSessionStore((state) => state.touchActivity)

  useEffect(() => {
    if (!lastActivityAt) {
      touchActivity()
    }
  }, [lastActivityAt, touchActivity])

  const handleAuthenticatedClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (isSessionTimeoutOpen) {
      return
    }

    const lastActivity = getPersistedLastActivityAt() ?? lastActivityAt ?? Date.now()
    const now = Date.now()
    const idleMs = now - lastActivity
    const isExpired = idleMs > SESSION_TIMEOUT_MS

    if (ENABLE_SESSION_TIMEOUT_LOGS) {
      console.info('[session-timeout]', {
        now: new Date(now).toISOString(),
        lastActivityAt: new Date(lastActivity).toISOString(),
        idleSeconds: Math.floor(idleMs / 1000),
        timeoutSeconds: SESSION_TIMEOUT_MS / 1000,
        isExpired,
      })
    }

    if (!isExpired) {
      touchActivity()
      return
    }

    event.preventDefault()
    event.stopPropagation()
    setIsMobileNavOpen(false)
    setIsSessionTimeoutOpen(true)
  }

  const handleSessionTimeoutConfirm = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex h-screen flex-col" onClickCapture={handleAuthenticatedClickCapture}>
      <TopNav onMenuClick={() => setIsMobileNavOpen(true)} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          isMobileOpen={isMobileNavOpen}
          onClose={() => setIsMobileNavOpen(false)}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-screen-xl">
            <Outlet />
          </div>
        </main>
      </div>

      {isSessionTimeoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-sm rounded-lg bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Session timeout</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your session has been inactive for more than 15 minutes. Please sign in again.
            </p>
            <button
              type="button"
              className="btn-primary mt-5 w-full"
              onClick={handleSessionTimeoutConfirm}
            >
              Back to login
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
