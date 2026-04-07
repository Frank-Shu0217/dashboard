import { Link } from 'react-router-dom'
import { useUser, useSessionStore } from '@session/sessionStore'
import { LogOut, User as UserIcon, Menu } from 'lucide-react'
import { useState } from 'react'

interface TopNavProps {
  onMenuClick: () => void
}

export function TopNav({ onMenuClick }: TopNavProps) {
  const user = useUser()
  const logout = useSessionStore((state) => state.logout)
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 hover:bg-muted md:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/dashboard" className="text-lg font-semibold">
          Dashboard
        </Link>
      </div>

      <div className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex items-center gap-2 rounded-md p-2 transition-colors hover:bg-muted"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10">
            <UserIcon className="h-4 w-4 text-brand" />
          </div>
          <span className="hidden text-sm font-medium sm:block">{user?.name}</span>
        </button>

        {menuOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setMenuOpen(false)}
            />
            <div className="absolute right-0 top-full z-20 mt-1 w-56 rounded-lg border bg-card py-1 shadow-lg">
              <div className="border-b px-4 py-2 sm:hidden">
                <p className="font-medium">{user?.name}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}
