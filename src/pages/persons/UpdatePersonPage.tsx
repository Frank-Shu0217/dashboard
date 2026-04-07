import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { personApi } from '@api/personApi'
import { ArrowLeft, Loader2, Search, Check } from 'lucide-react'

export default function UpdatePersonPage() {
  const navigate = useNavigate()
  const [personId, setPersonId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [personFound, setPersonFound] = useState(false)
  const [formData, setFormData] = useState({
    surname: '',
    firstName: '',
    birthDate: '',
    gender: 'M' as 'M' | 'F' | 'Other',
    companyId: '',
  })
  const [,] = useState<Record<string, string>>({})
  const [searchError, setSearchError] = useState('')

  const handleSearch = async () => {
    if (!personId.trim()) {
      setSearchError('Please enter a person ID')
      return
    }

    setIsSearching(true)
    setSearchError('')
    
    try {
      const response = await personApi.getPerson(personId.trim())
      const person = response.data
      
      setFormData({
        surname: person.surname,
        firstName: person.firstName,
        birthDate: person.birthDate,
        gender: person.gender,
        companyId: person.companyId,
      })
      setPersonFound(true)
    } catch {
      setSearchError('Person not found. Please check the ID and try again.')
      setPersonFound(false)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setIsSubmitting(true)
    try {
      await personApi.updatePerson(personId, formData)
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/dashboard/person/get')
      }, 1500)
    } catch (error) {
      console.error('Failed to update person:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
            <h1 className="text-xl font-semibold">Update Person</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search and update an existing person record
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
              <h3 className="text-lg font-semibold text-foreground">Person Updated!</h3>
              <p className="text-muted-foreground mt-2">
                The person record has been successfully updated.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Search Section */}
              {!personFound && (
                <div className="space-y-4">
                  <div>
                    <label htmlFor="personId" className="block text-sm font-medium mb-2">
                      Person ID
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="personId"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        className="input-field flex-1"
                        placeholder="Enter person ID (e.g., person-1)"
                      />
                      <button
                        onClick={handleSearch}
                        disabled={isSearching}
                        className="btn-primary"
                      >
                        {isSearching ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            Search
                          </>
                        )}
                      </button>
                    </div>
                    {searchError && (
                      <p className="text-destructive text-sm mt-2">{searchError}</p>
                    )}
                  </div>
                </div>
              )}

              {/* Edit Form */}
              {personFound && (
                <>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Editing: <span className="font-medium text-foreground">{personId}</span>
                    </span>
                    <button
                      onClick={() => {
                        setPersonFound(false)
                        setPersonId('')
                      }}
                      className="text-sm text-brand hover:underline"
                    >
                      Search different person
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Surname */}
                      <div>
                        <label htmlFor="surname" className="block text-sm font-medium mb-2">
                          Surname
                        </label>
                        <input
                          type="text"
                          id="surname"
                          name="surname"
                          value={formData.surname}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter surname"
                        />
                      </div>

                      {/* First Name */}
                      <div>
                        <label htmlFor="firstName" className="block text-sm font-medium mb-2">
                          First Name
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter first name"
                        />
                      </div>

                      {/* Birth Date */}
                      <div>
                        <label htmlFor="birthDate" className="block text-sm font-medium mb-2">
                          Birth Date
                        </label>
                        <input
                          type="date"
                          id="birthDate"
                          name="birthDate"
                          value={formData.birthDate}
                          onChange={handleChange}
                          className="input-field"
                        />
                      </div>

                      {/* Gender */}
                      <div>
                        <label htmlFor="gender" className="block text-sm font-medium mb-2">
                          Gender
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
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      {/* Company ID */}
                      <div className="md:col-span-2">
                        <label htmlFor="companyId" className="block text-sm font-medium mb-2">
                          Company ID
                        </label>
                        <input
                          type="text"
                          id="companyId"
                          name="companyId"
                          value={formData.companyId}
                          onChange={handleChange}
                          className="input-field"
                          placeholder="Enter company ID"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Available companies: comp-1 through comp-15
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
                            Updating...
                          </>
                        ) : (
                          'Update Person'
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
