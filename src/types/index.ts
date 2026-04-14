/**
 * Global TypeScript types and interfaces
 */

// User types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

// Person types
export interface Person {
  id: string
  surname: string
  firstName: string
  birthDate: string
  gender: 'M' | 'F' | 'Other'
  companyId: string
  companyName: string
}

export interface CreatePersonRequest {
  surname: string
  firstName: string
  birthDate: string
  gender: 'M' | 'F' | 'Other'
  companyId: string
}

export interface UpdatePersonRequest {
  surname?: string
  firstName?: string
  birthDate?: string
  gender?: 'M' | 'F' | 'Other'
  companyId?: string
}

// Company types
export interface Company {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  contact?: string
  running?: 'Yes' | 'No'
  createdAt: string
}

export interface CreateCompanyRequest {
  name: string
  address?: string
  phone?: string
  email?: string
  contact?: string
  running?: 'Yes' | 'No'
}

export interface UpdateCompanyRequest {
  name?: string
  address?: string
  phone?: string
  email?: string
  contact?: string
  running?: 'Yes' | 'No'
}

export interface ReportStatistics {
  totalPersons: number
  totalCompanies: number
  runningCompanies: number
  stoppedCompanies: number
  unassignedPersons: number
}

// API types
export interface ApiResponse<T> {
  data: T
  meta?: {
    page?: number
    limit?: number
    total?: number
    totalPages?: number
  }
}

export interface ApiError {
  code: string
  message: string
  details?: Record<string, string[]>
}

// Auth types
export interface AuthTokens {
  accessToken: string
  expiresAt: number
}

export interface PasskeyCredential {
  id: string
  rawId: ArrayBuffer
  response: AuthenticatorAttestationResponse
  type: 'public-key'
}

// Common types
export type Nullable<T> = T | null
export type Optional<T> = T | undefined

export interface PaginationParams {
  page: number
  limit: number
}

export interface FilterParams {
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}
