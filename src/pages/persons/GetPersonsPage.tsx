import { useState, useEffect } from 'react'
import { personApi } from '@api/personApi'
import type { Person } from '@/types'
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react'

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function GetPersonsPage() {
  const [persons, setPersons] = useState<Person[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchPersons = async (page: number, search?: string) => {
    setIsLoading(true)
    try {
      const response = await personApi.getPersons({
        page,
        limit: 10,
        search,
      })
      setPersons(response.data)
      setMeta({
        page: response.meta?.page ?? 1,
        limit: response.meta?.limit ?? 10,
        total: response.meta?.total ?? 0,
        totalPages: response.meta?.totalPages ?? 0,
      })
    } catch (error) {
      console.error('Failed to fetch persons:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchPersons(meta.page, searchTerm)
  }, [meta.page, searchTerm])

  const handleSearch = () => {
    fetchPersons(1, searchTerm)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta(prev => ({ ...prev, page: newPage }))
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getGenderLabel = (gender: string) => {
    switch (gender) {
      case 'M':
        return 'Male'
      case 'F':
        return 'Female'
      default:
        return 'Other'
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="sticky top-0 z-10 bg-background border-b px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Persons</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage and view all persons in the system
          </p>
        </div>
        
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search persons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              className="input-field w-full sm:w-64 pl-9"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
          <button
            onClick={handleSearch}
            className="btn-secondary"
            disabled={isLoading}
          >
            Search
          </button>
        </div>
      </div>

      {/* Table Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="card overflow-hidden p-0">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-brand" />
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-muted/50 border-b border-border">
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Person ID
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Surname
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        First Name
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Birth Date
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Gender
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Company ID
                      </th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-muted-foreground">
                        Company Name
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {persons.length === 0 ? (
                      <tr>
                        <td
                          colSpan={7}
                          className="px-4 py-12 text-center text-muted-foreground"
                        >
                          No persons found. Try adjusting your search.
                        </td>
                      </tr>
                    ) : (
                      persons.map((person) => (
                        <tr
                          key={person.id}
                          className={`
                            border-b border-border last:border-b-0
                            hover:bg-muted/30 transition-colors
                          `}
                        >
                          <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                            {person.id}
                          </td>
                          <td className="px-4 py-3 text-sm font-medium">
                            {person.surname}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {person.firstName}
                          </td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">
                            {formatDate(person.birthDate)}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`
                                inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                                ${
                                  person.gender === 'M'
                                    ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                    : person.gender === 'F'
                                    ? 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
                                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                                }
                              `}
                            >
                              {getGenderLabel(person.gender)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm font-mono text-muted-foreground">
                            {person.companyId}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {person.companyName}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-muted/20">
                  <div className="text-sm text-muted-foreground">
                    Showing{' '}
                    <span className="font-medium">
                      {(meta.page - 1) * meta.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-medium">
                      {Math.min(meta.page * meta.limit, meta.total)}
                    </span>{' '}
                    of <span className="font-medium">{meta.total}</span>{' '}
                    results
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(meta.page - 1)}
                      disabled={meta.page === 1 || isLoading}
                      className="btn-secondary p-2 min-w-0"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, meta.totalPages) },
                        (_, i) => {
                          // Show pages around current page
                          let pageNum: number
                          if (meta.totalPages <= 5) {
                            pageNum = i + 1
                          } else if (meta.page <= 3) {
                            pageNum = i + 1
                          } else if (meta.page >= meta.totalPages - 2) {
                            pageNum = meta.totalPages - 4 + i
                          } else {
                            pageNum = meta.page - 2 + i
                          }
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              disabled={isLoading}
                              className={`
                                min-w-[36px] h-9 px-2 rounded-md text-sm font-medium
                                transition-colors
                                ${
                                  pageNum === meta.page
                                    ? 'bg-brand text-white'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }
                              `}
                            >
                              {pageNum}
                            </button>
                          )
                        }
                      )}
                    </div>
                    <button
                      onClick={() => handlePageChange(meta.page + 1)}
                      disabled={meta.page === meta.totalPages || isLoading}
                      className="btn-secondary p-2 min-w-0"
                      aria-label="Next page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
