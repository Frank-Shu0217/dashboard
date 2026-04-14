import { apiClient } from './apiClient'
import { env } from '@config/env'
import type { Company, CreateCompanyRequest, UpdateCompanyRequest, ApiResponse, PaginationParams } from '@/types'

export interface GetCompaniesParams extends PaginationParams {
  search?: string
}

type BackendCompany = {
  id: string
  name?: string
  company_name?: string
  address?: string
  company_addr?: string
  phone?: string
  email?: string
  contact?: string
  company_contact?: string
  running?: 'Yes' | 'No'
  company_running?: 'Yes' | 'No'
  createdAt?: string
}

function normalizeCompany(company: BackendCompany): Company {
  const contact = company.contact ?? company.company_contact ?? company.email ?? company.phone ?? ''

  return {
    id: company.id,
    name: company.name ?? company.company_name ?? '',
    address: company.address ?? company.company_addr ?? '',
    phone: company.phone ?? contact,
    email: company.email ?? contact,
    contact,
    running: company.running ?? company.company_running ?? 'Yes',
    createdAt: company.createdAt ?? '',
  }
}

function toBackendCompany(company: CreateCompanyRequest | UpdateCompanyRequest) {
  if (env.ENABLE_MOCKS) {
    return company
  }

  return {
    company_name: company.name,
    company_addr: company.address,
    company_contact: company.contact ?? company.email ?? company.phone,
    company_running: company.running ?? 'Yes',
  }
}

function wrapCompanies(companies: Company[], params: GetCompaniesParams): ApiResponse<Company[]> {
  const search = params.search?.trim().toLowerCase()
  const filtered = search
    ? companies.filter((company) =>
        [
          company.id,
          company.name,
          company.address ?? '',
          company.contact ?? '',
          company.running ?? '',
        ].some((value) => value.toLowerCase().includes(search))
      )
    : companies

  const page = params.page || 1
  const limit = params.limit || filtered.length || 10
  const start = (page - 1) * limit
  const data = filtered.slice(start, start + limit)

  return {
    data,
    meta: {
      page,
      limit,
      total: filtered.length,
      totalPages: Math.ceil(filtered.length / limit),
    },
  }
}

export const companyApi = {
  // Get companies list with pagination
  getCompanies: async (params: GetCompaniesParams): Promise<ApiResponse<Company[]>> => {
    const { data } = await apiClient.get('/api/companies', { params })
    if (Array.isArray(data)) {
      return wrapCompanies(data.map(normalizeCompany), params)
    }

    return {
      ...data,
      data: data.data.map(normalizeCompany),
    }
  },

  // Get single company
  getCompany: async (id: string): Promise<ApiResponse<Company>> => {
    const { data } = await apiClient.get(`/api/companies/${id}`)
    return { data: normalizeCompany(data.data ?? data) }
  },

  // Create company
  createCompany: async (company: CreateCompanyRequest): Promise<ApiResponse<Company>> => {
    const { data } = await apiClient.post('/api/companies', toBackendCompany(company))
    return { data: normalizeCompany(data.data ?? data) }
  },

  // Update company
  updateCompany: async (id: string, company: UpdateCompanyRequest): Promise<ApiResponse<Company>> => {
    const { data } = await apiClient.put(`/api/companies/${id}`, toBackendCompany(company))
    return { data: normalizeCompany(data.data ?? data) }
  },

  // Delete company
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/companies/${id}`)
  },

  restoreCompany: async (id: string): Promise<void> => {
    await apiClient.post(`/api/companies/${id}/restore`)
  },
}
