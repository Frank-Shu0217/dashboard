import { useEffect, useState } from 'react'
import { reportApi } from '@api/reportApi'
import type { Company, Person, ReportStatistics } from '@/types'
import { FileText, Loader2, RefreshCcw } from 'lucide-react'

export default function ReportsPage() {
  const [stats, setStats] = useState<ReportStatistics | null>(null)
  const [persons, setPersons] = useState<Person[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchReports = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const [nextStats, nextPersons, nextCompanies] = await Promise.all([
        reportApi.getStatistics(),
        reportApi.exportPersons(),
        reportApi.exportCompanies(),
      ])
      setStats(nextStats)
      setPersons(nextPersons)
      setCompanies(nextCompanies)
    } catch {
      setError('Failed to load report data')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold">Report</h1>
            <p className="mt-1 text-sm text-muted-foreground">View system reports and analytics</p>
          </div>
          <button type="button" onClick={fetchReports} className="btn-secondary" disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCcw className="h-4 w-4" />}
            Refresh
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto p-4">
        {error && (
          <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {isLoading && !stats ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand" />
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[
                ['Persons', stats?.totalPersons ?? 0],
                ['Companies', stats?.totalCompanies ?? 0],
                ['Running', stats?.runningCompanies ?? 0],
                ['Stopped', stats?.stoppedCompanies ?? 0],
                ['Unassigned', stats?.unassignedPersons ?? 0],
              ].map(([label, value]) => (
                <div key={label} className="card">
                  <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 text-2xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 xl:grid-cols-2">
              <div className="card overflow-hidden p-0">
                <div className="border-b px-4 py-3">
                  <h2 className="font-medium">Persons Export</h2>
                </div>
                <div className="max-h-96 overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Company</th>
                      </tr>
                    </thead>
                    <tbody>
                      {persons.map((person) => (
                        <tr key={person.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{person.id}</td>
                          <td className="px-4 py-3 text-sm">{person.firstName} {person.surname}</td>
                          <td className="px-4 py-3 text-sm">{person.companyId || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="card overflow-hidden p-0">
                <div className="border-b px-4 py-3">
                  <h2 className="font-medium">Companies Export</h2>
                </div>
                <div className="max-h-96 overflow-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Running</th>
                      </tr>
                    </thead>
                    <tbody>
                      {companies.map((company) => (
                        <tr key={company.id} className="border-b last:border-b-0">
                          <td className="px-4 py-3 font-mono text-sm text-muted-foreground">{company.id}</td>
                          <td className="px-4 py-3 text-sm">{company.name}</td>
                          <td className="px-4 py-3 text-sm">{company.running}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
