import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyApi } from '@api/companyApi'
import type { Company } from '@/types'
import { AlertTriangle, ArrowLeft, Check, Loader2, Search, Trash2 } from 'lucide-react'

export default function DeleteCompanyPage() {
  const navigate = useNavigate()
  const [companyId, setCompanyId] = useState('')
  const [company, setCompany] = useState<Company | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isRestoring, setIsRestoring] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [searchError, setSearchError] = useState('')

  const handleSearch = async () => {
    if (!/^\d{9}$/.test(companyId.trim())) {
      setSearchError('Company ID must be 9 digits')
      return
    }

    setIsSearching(true)
    setSearchError('')
    try {
      const response = await companyApi.getCompany(companyId.trim())
      setCompany(response.data)
    } catch {
      setSearchError('Company not found. Please check the ID and try again.')
      setCompany(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await companyApi.deleteCompany(companyId)
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard/company/get'), 1500)
    } catch (error) {
      console.error('Failed to stop company:', error)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
    }
  }

  const handleRestore = async () => {
    setIsRestoring(true)
    try {
      await companyApi.restoreCompany(companyId)
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard/company/get'), 1500)
    } catch (error) {
      console.error('Failed to restore company:', error)
    } finally {
      setIsRestoring(false)
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/company/get')}
            className="btn-secondary min-w-0 p-2"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Delete Company</h1>
            <p className="mt-1 text-sm text-muted-foreground">Stop or restore a company record</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="card mx-auto max-w-2xl">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Company Updated!</h3>
              <p className="mt-2 text-muted-foreground">The company status has been updated.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {!company && (
                <div>
                  <label htmlFor="companyId" className="mb-2 block text-sm font-medium">
                    Company ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      id="companyId"
                      type="text"
                      value={companyId}
                      onChange={(event) => setCompanyId(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                      className="input-field flex-1"
                      placeholder="Enter company ID (e.g., 000000001)"
                    />
                    <button onClick={handleSearch} disabled={isSearching} className="btn-primary">
                      {isSearching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                      Search
                    </button>
                  </div>
                  {searchError && <p className="mt-2 text-sm text-destructive">{searchError}</p>}
                </div>
              )}

              {company && (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      Found: <span className="font-medium text-foreground">{company.id}</span>
                    </span>
                    <button
                      onClick={() => {
                        setCompany(null)
                        setCompanyId('')
                      }}
                      className="text-sm text-brand hover:underline"
                    >
                      Search different company
                    </button>
                  </div>

                  <div className="rounded-lg border border-border bg-muted/30 p-4">
                    <h4 className="mb-3 font-medium">Company Details</h4>
                    <div className="grid gap-4 text-sm sm:grid-cols-2">
                      <div>
                        <span className="text-muted-foreground">Name:</span>
                        <p className="font-medium">{company.name}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Running:</span>
                        <p className="font-medium">{company.running}</p>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="text-muted-foreground">Address:</span>
                        <p className="font-medium">{company.address || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {company.running === 'No' ? (
                    <div className="flex justify-end gap-3 border-t border-border pt-4">
                      <button type="button" onClick={() => navigate('/dashboard/company/get')} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="button" onClick={handleRestore} disabled={isRestoring} className="btn-primary">
                        {isRestoring ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                        Restore Company
                      </button>
                    </div>
                  ) : showConfirm ? (
                    <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
                      <h4 className="mb-4 font-medium text-destructive">Confirm Stop</h4>
                      <p className="mb-6 text-sm">
                        Stop <strong>{company.name}</strong>? This sets company_running to No.
                      </p>
                      <div className="flex justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setShowConfirm(false)}
                          className="btn-secondary"
                          disabled={isDeleting}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-destructive/90 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                          Confirm Stop
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-destructive" />
                          <p className="text-sm text-destructive/80">
                            Delete is a soft delete. The company will be marked as not running.
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 border-t border-border pt-4">
                        <button type="button" onClick={() => navigate('/dashboard/company/get')} className="btn-secondary">
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirm(true)}
                          className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-lg bg-destructive px-4 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-destructive/90"
                        >
                          <Trash2 className="h-4 w-4" />
                          Stop Company
                        </button>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
