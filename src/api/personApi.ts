import { apiClient } from './apiClient'
import { env } from '@config/env'
import type { Person, CreatePersonRequest, UpdatePersonRequest, ApiResponse, PaginationParams } from '@/types'

export interface GetPersonsParams extends PaginationParams {
  search?: string
}

type BackendPerson = {
  id: number | string
  surname: string
  first_name?: string
  firstName?: string
  birth_date?: string
  birthDate?: string
  gender: 'M' | 'F' | 'Other'
  company_id?: string
  companyId?: string
  company_name?: string
  companyName?: string
}

function toDisplayDate(value: string) {
  if (!value) return value
  if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
    const [day, month, year] = value.split('-')
    return `${year}-${month}-${day}`
  }
  return value
}

function toBackendDate(value: string | undefined) {
  if (!value) return value
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-')
    return `${day}-${month}-${year}`
  }
  return value
}

function normalizePerson(person: BackendPerson): Person {
  return {
    id: String(person.id),
    surname: person.surname,
    firstName: person.firstName ?? person.first_name ?? '',
    birthDate: toDisplayDate(person.birthDate ?? person.birth_date ?? ''),
    gender: person.gender,
    companyId: person.companyId ?? person.company_id ?? '',
    companyName: person.companyName ?? person.company_name ?? '',
  }
}

function toBackendPerson(person: CreatePersonRequest | UpdatePersonRequest) {
  if (env.ENABLE_MOCKS) {
    return person
  }

  return {
    surname: person.surname,
    first_name: person.firstName,
    birth_date: toBackendDate(person.birthDate),
    gender: person.gender,
    company_id: person.companyId,
  }
}

function wrapPersons(persons: Person[], params: GetPersonsParams): ApiResponse<Person[]> {
  const search = params.search?.trim().toLowerCase()
  const filtered = search
    ? persons.filter((person) =>
        [
          person.id,
          person.surname,
          person.firstName,
          person.companyId,
          person.companyName,
        ].some((value) => value.toLowerCase().includes(search))
      )
    : persons

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

export const personApi = {
  // Get persons list with pagination
  getPersons: async (params: GetPersonsParams): Promise<ApiResponse<Person[]>> => {
    const { data } = await apiClient.get('/api/persons', { params })
    if (Array.isArray(data)) {
      return wrapPersons(data.map(normalizePerson), params)
    }

    return {
      ...data,
      data: data.data.map(normalizePerson),
    }
  },

  // Get single person
  getPerson: async (id: string): Promise<ApiResponse<Person>> => {
    if (/^\d+$/.test(id)) {
      const persons = await personApi.getPersons({ page: 1, limit: Number.MAX_SAFE_INTEGER })
      const person = persons.data.find((entry) => entry.id === id)
      if (!person) {
        throw new Error('Person not found')
      }
      return { data: person }
    }

    const { data } = await apiClient.get(`/api/persons/${id}/company`)
    return { data: normalizePerson(data) }
  },

  // Create person
  createPerson: async (person: CreatePersonRequest): Promise<ApiResponse<Person>> => {
    const { data } = await apiClient.post('/api/persons', toBackendPerson(person))
    return { data: normalizePerson(data) }
  },

  // Update person
  updatePerson: async (id: string, person: UpdatePersonRequest): Promise<ApiResponse<Person>> => {
    const { data } = await apiClient.put(`/api/persons/${id}`, toBackendPerson(person))
    return { data: normalizePerson(data) }
  },

  // Delete person
  deletePerson: async (id: string): Promise<void> => {
    await apiClient.delete(`/api/persons/${id}`)
  },
}
