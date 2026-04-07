import { apiClient } from './apiClient'
import type { Company, CreateCompanyRequest, UpdateCompanyRequest, ApiResponse, PaginationParams } from '@/types'

export interface GetCompaniesParams extends PaginationParams {
  search?: string
}

export const companyApi = {
  // Get companies list with pagination
  getCompanies: async (params: GetCompaniesParams): Promise<ApiResponse<Company[]>> => {
    const { data } = await apiClient.get('/api/companies', { params })
    return data
  },

  // Get single company
  getCompany: async (id: string): Promise<ApiResponse<Company>> => {
    const { data } = await apiClient.get(`/api/companies/${id}`)
    return data
  },

  // Create company
  createCompany: async (company: CreateCompanyRequest): Promise<ApiResponse<Company>> => {
    const { data } = await apiClient.post('/api/companies', company)
    return data
  },

  // Update company
  updateCompany: async (id: string, company: UpdateCompanyRequest): Promise<ApiResponse<Company>> => {
    const { data } = await apiClient.put(`/api/companies/${id}`, company)
    return data
  },

  // Delete company
  deleteCompany: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/companies/${id}`)
  },
}
