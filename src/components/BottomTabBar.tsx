import { NavLink } from 'react-router-dom'
import { Settings, LayoutDashboard } from 'lucide-react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

/**
 * Bottom Tab Bar - Mobile only navigation
 */
export function BottomTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t safe-bottom z-40">
      <div className="flex items-center justify-around">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `
              flex flex-col items-center justify-center py-2 px-4 min-h-[56px]
              transition-colors flex-1
              ${isActive 
                ? 'text-brand' 
                : 'text-muted-foreground'
              }
            `}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs mt-0.5">{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
