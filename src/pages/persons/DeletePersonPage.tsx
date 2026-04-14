import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { personApi } from '@api/personApi'
import { ArrowLeft, Loader2, Search, Trash2, AlertTriangle, Check } from 'lucide-react'

export default function DeletePersonPage() {
  const navigate = useNavigate()
  const [personId, setPersonId] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [personFound, setPersonFound] = useState(false)
  const [personData, setPersonData] = useState<{
    surname: string
    firstName: string
    companyName: string
  } | null>(null)
  const [searchError, setSearchError] = useState('')
  const [showConfirm, setShowConfirm] = useState(false)

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
      
      setPersonData({
        surname: person.surname,
        firstName: person.firstName,
        companyName: person.companyName,
      })
      setPersonFound(true)
    } catch {
      setSearchError('Person not found. Please check the ID and try again.')
      setPersonFound(false)
    } finally {
      setIsSearching(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await personApi.deletePerson(personId)
      setShowSuccess(true)
      setTimeout(() => {
        navigate('/dashboard/person/get')
      }, 1500)
    } catch (error) {
      console.error('Failed to delete person:', error)
    } finally {
      setIsDeleting(false)
      setShowConfirm(false)
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
            <h1 className="text-xl font-semibold">Delete Person</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Search and delete a person record
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
              <h3 className="text-lg font-semibold text-foreground">Person Deleted!</h3>
              <p className="text-muted-foreground mt-2">
                The person record has been permanently removed from the system.
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
                        placeholder="Enter surname or numeric person ID"
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

              {/* Delete Confirmation */}
              {personFound && personData && (
                <>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-sm text-muted-foreground">
                      Found: <span className="font-medium text-foreground">{personId}</span>
                    </span>
                    <button
                      onClick={() => {
                        setPersonFound(false)
                        setPersonId('')
                        setPersonData(null)
                      }}
                      className="text-sm text-brand hover:underline"
                    >
                      Search different person
                    </button>
                  </div>

                  {!showConfirm ? (
                    <div className="space-y-4">
                      <div className="p-4 border border-border rounded-lg bg-muted/30">
                        <h4 className="font-medium mb-3">Person Details</h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Name:</span>
                            <p className="font-medium">{personData.firstName} {personData.surname}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Company:</span>
                            <p className="font-medium">{personData.companyName}</p>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                        <div className="flex items-start gap-3">
                          <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-medium text-destructive">Warning</h4>
                            <p className="text-sm text-destructive/80 mt-1">
                              This action cannot be undone. This will permanently delete the person record from the system.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end gap-3 pt-4 border-t border-border">
                        <button
                          type="button"
                          onClick={() => navigate('/dashboard/person/get')}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowConfirm(true)}
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                                     bg-destructive text-white font-medium text-sm
                                     hover:bg-destructive/90 active:scale-95 transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                                     min-h-11 min-w-11"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Person
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 border border-destructive/30 bg-destructive/5 rounded-lg">
                      <h4 className="font-medium text-destructive mb-4">Confirm Deletion</h4>
                      <p className="text-sm mb-6">
                        Are you sure you want to delete <strong>{personData.firstName} {personData.surname}</strong>? 
                        This action cannot be undone.
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
                          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg 
                                     bg-destructive text-white font-medium text-sm
                                     hover:bg-destructive/90 active:scale-95 transition-all duration-200
                                     disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100
                                     min-h-11 min-w-11"
                        >
                          {isDeleting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4" />
                              Confirm Delete
                            </>
                          )}
                        </button>
                      </div>
                    </div>
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
