import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { companyApi } from '@api/companyApi'
import type { Company } from '@/types'
import { ArrowLeft, ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react'

interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export default function GetCompaniesPage() {
  const navigate = useNavigate()
  const [companies, setCompanies] = useState<Company[]>([])
  const [meta, setMeta] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCompanies = async (page: number, search?: string) => {
    setIsLoading(true)
    try {
      const response = await companyApi.getCompanies({ page, limit: 10, search })
      setCompanies(response.data)
      setMeta({
        page: response.meta?.page ?? 1,
        limit: response.meta?.limit ?? 10,
        total: response.meta?.total ?? response.data.length,
        totalPages: response.meta?.totalPages ?? 1,
      })
    } catch (error) {
      console.error('Failed to fetch companies:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies(meta.page, searchTerm)
  }, [meta.page, searchTerm])

  const handleSearch = () => {
    setMeta((prev) => ({ ...prev, page: 1 }))
    fetchCompanies(1, searchTerm)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= meta.totalPages) {
      setMeta((prev) => ({ ...prev, page: newPage }))
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-secondary min-w-0 p-2"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">Companies</h1>
              <p className="mt-1 text-sm text-muted-foreground">View and manage companies</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && handleSearch()}
                className="input-field w-full pl-9 sm:w-64"
              />
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            </div>
            <button onClick={handleSearch} className="btn-secondary" disabled={isLoading}>
              Search
            </button>
          </div>
        </div>
      </div>

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
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Address</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Contact</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Running</th>
                    </tr>
                  </thead>
                  <tbody>
                    {companies.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                          No companies found.
                        </td>
                      </tr>
                    ) : (
                      companies.map((company) => (
                        <tr
                          key={company.id}
                          className="border-b border-border transition-colors last:border-b-0 hover:bg-muted/30"
                        >
                          <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{company.id}</td>
                          <td className="px-4 py-3 text-sm font-medium">{company.name}</td>
                          <td className="px-4 py-3 text-sm text-muted-foreground">{company.address || '-'}</td>
                          <td className="px-4 py-3 text-sm">{company.contact || company.email || '-'}</td>
                          <td className="px-4 py-3 text-sm">
                            <span
                              className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                                company.running === 'No'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-green-100 text-green-700'
                              }`}
                            >
                              {company.running ?? 'Yes'}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border bg-muted/20 px-4 py-3">
                  <div className="text-sm text-muted-foreground">
                    {meta.total} result(s)
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePageChange(meta.page - 1)}
                      disabled={meta.page === 1 || isLoading}
                      className="btn-secondary min-w-0 p-2"
                      aria-label="Previous page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm text-muted-foreground">
                      Page {meta.page} of {meta.totalPages}
                    </span>
                    <button
                      onClick={() => handlePageChange(meta.page + 1)}
                      disabled={meta.page === meta.totalPages || isLoading}
                      className="btn-secondary min-w-0 p-2"
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
