import { apiClient } from './apiClient'
import type { Person, CreatePersonRequest, UpdatePersonRequest, ApiResponse, PaginationParams } from '@/types'

export interface GetPersonsParams extends PaginationParams {
  search?: string
}

export const personApi = {
  // Get persons list with pagination
  getPersons: async (params: GetPersonsParams): Promise<ApiResponse<Person[]>> => {
    const { data } = await apiClient.get('/api/persons', { params })
    return data
  },

  // Get single person
  getPerson: async (id: string): Promise<ApiResponse<Person>> => {
    const { data } = await apiClient.get(`/api/persons/${id}`)
    return data
  },

  // Create person
  createPerson: async (person: CreatePersonRequest): Promise<ApiResponse<Person>> => {
    const { data } = await apiClient.post('/api/persons', person)
    return data
  },

  // Update person
  updatePerson: async (id: string, person: UpdatePersonRequest): Promise<ApiResponse<Person>> => {
    const { data } = await apiClient.put(`/api/persons/${id}`, person)
    return data
  },

  // Delete person
  deletePerson: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/persons/${id}`)
  },
}
