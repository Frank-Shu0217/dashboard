import { apiClient } from './apiClient'
import type { Company, Person, ReportStatistics } from '@/types'
import { companyApi } from './companyApi'
import { personApi } from './personApi'

export const reportApi = {
  getStatistics: async (): Promise<ReportStatistics> => {
    try {
      const { data } = await apiClient.get('/api/reports/statistics')
      return data
    } catch {
      const [persons, companies] = await Promise.all([
        personApi.getPersons({ page: 1, limit: Number.MAX_SAFE_INTEGER }),
        companyApi.getCompanies({ page: 1, limit: Number.MAX_SAFE_INTEGER }),
      ])
      const runningCompanies = companies.data.filter((company) => company.running !== 'No').length

      return {
        totalPersons: persons.data.length,
        totalCompanies: companies.data.length,
        runningCompanies,
        stoppedCompanies: companies.data.length - runningCompanies,
        unassignedPersons: persons.data.filter((person) => !person.companyId).length,
      }
    }
  },

  exportPersons: async (): Promise<Person[]> => {
    try {
      const { data } = await apiClient.get('/api/reports/export/persons')
      if (Array.isArray(data)) {
        return data.map((person) => ({
          id: String(person.id),
          surname: person.surname,
          firstName: person.firstName ?? person.first_name ?? '',
          birthDate: person.birthDate ?? person.birth_date ?? '',
          gender: person.gender,
          companyId: person.companyId ?? person.company_id ?? '',
          companyName: person.companyName ?? person.company_name ?? '',
        }))
      }
    } catch {
      // Fall through to the client-side export used by mock mode.
    }

    return personApi.getPersons({ page: 1, limit: Number.MAX_SAFE_INTEGER }).then((response) => response.data)
  },

  exportCompanies: async (): Promise<Company[]> => {
    try {
      const { data } = await apiClient.get('/api/reports/export/companies')
      if (Array.isArray(data)) {
        return data.map((company) => ({
          id: company.id,
          name: company.name ?? company.company_name ?? '',
          address: company.address ?? company.company_addr ?? '',
          phone: company.phone ?? company.company_contact ?? '',
          email: company.email ?? company.company_contact ?? '',
          contact: company.contact ?? company.company_contact ?? '',
          running: company.running ?? company.company_running ?? 'Yes',
          createdAt: company.createdAt ?? '',
        }))
      }
    } catch {
      // Fall through to the client-side export used by mock mode.
    }

    return companyApi.getCompanies({ page: 1, limit: Number.MAX_SAFE_INTEGER }).then((response) => response.data)
  },
}
