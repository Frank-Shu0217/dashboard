import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'

export default function UpdateCompanyPage() {
  const navigate = useNavigate()

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/company/get')}
            className="btn-secondary p-2 min-w-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Update Company</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Update an existing company record
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="card max-w-2xl mx-auto text-center py-16">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <Building2 className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Update Company</h3>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            This page will allow you to update company details. 
            Implementation coming soon.
          </p>
        </div>
      </div>
    </div>
  )
}
