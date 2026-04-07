import { ReactNode } from 'react'

interface PageLayoutProps {
  title: string
  children: ReactNode
  actions?: ReactNode
  breadcrumbs?: ReactNode
  filters?: ReactNode
}

/**
 * Page Layout - Composable header + content structure
 * Sticky page header keeps title and actions visible
 */
export function PageLayout({
  title,
  children,
  actions,
  breadcrumbs,
  filters,
}: PageLayoutProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Sticky page header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-3 flex items-center justify-between -mx-4 md:-mx-6 lg:-mx-8 md:px-6 lg:px-8">
        <div>
          {breadcrumbs && <div className="mb-1">{breadcrumbs}</div>}
          <h1 className="text-xl font-semibold">{title}</h1>
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>

      {/* Optional filter bar */}
      {filters && (
        <div className="border-b px-4 py-3 bg-muted/40 -mx-4 md:-mx-6 lg:-mx-8 md:px-6 lg:px-8">
          {filters}
        </div>
      )}

      {/* Scrollable content */}
      <div className="flex-1 py-6">{children}</div>
    </div>
  )
}
