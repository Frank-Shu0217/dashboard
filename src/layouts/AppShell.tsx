import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { TopNav } from '@components/TopNav'
import { Sidebar } from '@components/Sidebar'

export function AppShell() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen flex-col">
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
    </div>
  )
}
