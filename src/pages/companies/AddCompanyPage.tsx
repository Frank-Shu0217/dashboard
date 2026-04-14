import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyApi } from '@api/companyApi'
import { ArrowLeft, Check, Loader2 } from 'lucide-react'

export default function AddCompanyPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    contact: '',
    running: 'Yes' as 'Yes' | 'No',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const nextErrors: Record<string, string> = {}
    if (!formData.name.trim()) {
      nextErrors.name = 'Company name is required'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      await companyApi.createCompany(formData)
      setShowSuccess(true)
      setTimeout(() => navigate('/dashboard/company/get'), 1500)
    } catch (error) {
      console.error('Failed to create company:', error)
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
            <h1 className="text-xl font-semibold">Add Company</h1>
            <p className="mt-1 text-sm text-muted-foreground">Create a new company record</p>
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
              <h3 className="text-lg font-semibold text-foreground">Company Created!</h3>
              <p className="mt-2 text-muted-foreground">The company has been added.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    Company Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className={`input-field ${errors.name ? 'border-destructive focus:border-destructive' : ''}`}
                    placeholder="Enter company name"
                  />
                  {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="address" className="mb-2 block text-sm font-medium">
                    Address
                  </label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter company address"
                  />
                </div>

                <div>
                  <label htmlFor="contact" className="mb-2 block text-sm font-medium">
                    Contact
                  </label>
                  <input
                    id="contact"
                    name="contact"
                    type="text"
                    value={formData.contact}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Enter company contact"
                  />
                </div>

                <div>
                  <label htmlFor="running" className="mb-2 block text-sm font-medium">
                    Running
                  </label>
                  <select
                    id="running"
                    name="running"
                    value={formData.running}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="Yes">Yes</option>
                    <option value="No">No</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 border-t border-border pt-4">
                <button type="button" onClick={() => navigate('/dashboard/company/get')} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Company'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
