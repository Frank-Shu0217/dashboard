import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { personApi } from '@api/personApi'
import { ArrowLeft, Loader2, Check } from 'lucide-react'

export default function AddPersonPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    birthDate: '',
    gender: 'M' as 'M' | 'F',
    companyId: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.surname.trim()) {
      newErrors.surname = 'Surname is required'
    }
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }
    if (!formData.birthDate) {
      newErrors.birthDate = 'Birth date is required'
    }
    if (!/^\d{9}$/.test(formData.companyId)) {
      newErrors.companyId = 'Company ID must be 9 digits'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsSubmitting(true)
    try {
      await personApi.createPerson(formData)
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/dashboard/person/get')
      }, 1500)
    } catch (error) {
      console.error('Failed to create person:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard/person/get')}
            className="btn-secondary p-2 min-w-0"
            aria-label="Go back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-semibold">Add Person</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new person record
            </p>
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="card max-w-2xl mx-auto">
          {showSuccess ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Check className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Person Created!</h3>
              <p className="text-muted-foreground mt-2">
                The person has been successfully added to the system.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Surname */}
                <div>
                  <label htmlFor="surname" className="block text-sm font-medium mb-2">
                    Surname <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="surname"
                    name="surname"
                    value={formData.surname}
                    onChange={handleChange}
                    className={`input-field ${errors.surname ? 'border-destructive focus:border-destructive' : ''}`}
                    placeholder="Enter surname"
                  />
                  {errors.surname && (
                    <p className="text-destructive text-sm mt-1">{errors.surname}</p>
                  )}
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                    First Name <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`input-field ${errors.firstName ? 'border-destructive focus:border-destructive' : ''}`}
                    placeholder="Enter first name"
                  />
                  {errors.firstName && (
                    <p className="text-destructive text-sm mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Birth Date */}
                <div>
                  <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                    Birth Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    id="birthDate"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleChange}
                    className={`input-field ${errors.birthDate ? 'border-destructive focus:border-destructive' : ''}`}
                  />
                  {errors.birthDate && (
                    <p className="text-destructive text-sm mt-1">{errors.birthDate}</p>
                  )}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium mb-2">
                    Gender <span className="text-destructive">*</span>
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>

                {/* Company ID */}
                <div className="md:col-span-2">
                  <label htmlFor="companyId" className="block text-sm font-medium mb-2">
                    Company ID <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="companyId"
                    name="companyId"
                    value={formData.companyId}
                    onChange={handleChange}
                    className={`input-field ${errors.companyId ? 'border-destructive focus:border-destructive' : ''}`}
                    placeholder="Enter company ID (e.g., 000000001)"
                  />
                  {errors.companyId && (
                    <p className="text-destructive text-sm mt-1">{errors.companyId}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    Sample companies: 000000001, 000000002, 000000003
                  </p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/person/get')}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Person'
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
