import { FileText } from 'lucide-react'

export default function ReportsPage() {
  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-4">
        <div>
          <h1 className="text-xl font-semibold">Report</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            View system reports and analytics
          </p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="card mx-auto max-w-2xl py-16 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileText className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Report Home</h3>
          <p className="mx-auto mt-2 max-w-sm text-muted-foreground">
            Report Home is intentionally a placeholder in v1 while Person flows are implemented first.
          </p>
        </div>
      </div>
    </div>
  )
}
