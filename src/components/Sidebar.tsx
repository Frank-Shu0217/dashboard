import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  User,
  Building2,
  FileText,
  ChevronDown,
  ChevronRight,
  Search,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react'

interface SubMenuItem {
  to: string
  icon: React.ComponentType<{ className?: string }>
  label: string
}

interface MenuItem {
  to?: string
  icon: React.ComponentType<{ className?: string }>
  label: string
  children?: SubMenuItem[]
}

interface SidebarProps {
  isMobileOpen: boolean
  onClose: () => void
}

const menuItems: MenuItem[] = [
  {
    icon: User,
    label: 'Person',
    children: [
      { to: '/dashboard/person/get', icon: Search, label: 'Get Person' },
      { to: '/dashboard/person/add', icon: Plus, label: 'Add Person' },
      { to: '/dashboard/person/update', icon: Edit, label: 'Update Person' },
      { to: '/dashboard/person/delete', icon: Trash2, label: 'Delete Person' },
    ],
  },
  {
    icon: Building2,
    label: 'Company',
    children: [
      { to: '/dashboard/company/get', icon: Search, label: 'Get Company' },
      { to: '/dashboard/company/add', icon: Plus, label: 'Add Company' },
      { to: '/dashboard/company/update', icon: Edit, label: 'Update Company' },
      { to: '/dashboard/company/delete', icon: Trash2, label: 'Delete Company' },
    ],
  },
  { to: '/dashboard/report', icon: FileText, label: 'Report' },
]

function MenuItemComponent({
  item,
  onNavigate,
}: {
  item: MenuItem
  onNavigate?: () => void
}) {
  const location = useLocation()
  const [isExpanded, setIsExpanded] = useState(() => {
    if (item.children) {
      return item.children.some((child) => location.pathname.startsWith(child.to))
    }
    return false
  })

  if (!item.children) {
    const destination = item.to || '/dashboard'

    return (
      <NavLink
        to={destination}
        onClick={onNavigate}
        className={({ isActive }) => `
          flex min-h-11 items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors
          ${isActive ? 'bg-brand/10 text-brand' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
        `}
      >
        <item.icon className="h-5 w-5 shrink-0" />
        <span>{item.label}</span>
      </NavLink>
    )
  }

  const isActive = item.children.some((child) => location.pathname.startsWith(child.to))

  return (
    <div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`
          flex min-h-11 w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors
          ${isActive ? 'bg-brand/10 text-brand' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
        `}
      >
        <div className="flex items-center gap-3">
          <item.icon className="h-5 w-5 shrink-0" />
          <span>{item.label}</span>
        </div>
        {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>

      {isExpanded && (
        <div className="mt-1 ml-4 space-y-1 border-l border-border pl-4">
          {item.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              onClick={onNavigate}
              className={({ isActive }) => `
                flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors
                ${isActive ? 'font-medium text-brand' : 'text-muted-foreground hover:text-foreground'}
              `}
            >
              <child.icon className="h-4 w-4 shrink-0" />
              <span>{child.label}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {menuItems.map((item) => (
        <MenuItemComponent key={item.label} item={item} onNavigate={onNavigate} />
      ))}
    </nav>
  )
}

export function Sidebar({ isMobileOpen, onClose }: SidebarProps) {
  return (
    <>
      <aside className="hidden shrink-0 flex-col border-r border-border bg-background md:flex md:w-72">
        <div className="border-b px-4 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Navigation
          </p>
        </div>
        <SidebarNav />
      </aside>

      {isMobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-slate-950/40"
            onClick={onClose}
            aria-label="Close navigation"
          />
          <aside className="relative h-full w-[18.5rem] border-r border-border bg-background shadow-xl">
            <div className="border-b px-4 py-4">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                Navigation
              </p>
            </div>
            <SidebarNav onNavigate={onClose} />
          </aside>
        </div>
      )}
    </>
  )
}
