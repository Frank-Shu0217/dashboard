import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyApi } from '@api/companyApi'
import { ArrowLeft, Check, Loader2, Search } from 'lucide-react'

export default function UpdateCompanyPage() {
  const navigate = useNavigate()
  const [companyId, setCompanyId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [companyFound, setCompanyFound] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    running: 'Yes' as 'Yes' | 'No',
  })

  const handleSearch = async () => {
    if (!/^\d{9}$/.test(companyId.trim())) {
      setSearchError('Company ID must be 9 digits')
      return
    }

    setIsSearching(true)
    setSearchError('')
    try {
      const response = await companyApi.getCompany(companyId.trim())
      const company = response.data
      setFormData({
        name: company.name,
        address: company.address ?? '',
        contact: company.contact ?? company.email ?? '',
        running: company.running ?? 'Yes',
      })
      setCompanyFound(true)
    } catch {
      setSearchError('Company not found. Please check the ID and try again.')
      setCompanyFound(false)
    } finally {
      setIsSearching(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    try {
      await companyApi.updateCompany(companyId, formData)
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard/company/get'), 1500)
    } catch (error) {
      console.error('Failed to update company:', error)
    } finally {
      setIsSubmitting(false)
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
            <h1 className="text-xl font-semibold">Update Company</h1>
            <p className="mt-1 text-sm text-muted-foreground">Update an existing company record</p>
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
              <p className="mt-2 text-muted-foreground">The company record has been updated.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {!companyFound && (
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

              {companyFound && (
                <>
                  <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
                    <span className="text-sm text-muted-foreground">
                      Editing: <span className="font-medium text-foreground">{companyId}</span>
                    </span>
                    <button
                      onClick={() => {
                        setCompanyFound(false)
                        setCompanyId('')
                      }}
                      className="text-sm text-brand hover:underline"
                    >
                      Search different company
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <input
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Company name"
                      />
                      <input
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Address"
                      />
                      <input
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="Contact"
                      />
                      <select
                        name="running"
                        value={formData.running}
                        onChange={handleChange}
                        className="input-field"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>

                    <div className="flex justify-end gap-3 border-t border-border pt-4">
                      <button type="button" onClick={() => navigate('/dashboard/company/get')} className="btn-secondary">
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          'Update Company'
                        )}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
