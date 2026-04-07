import { AxiosError } from 'axios'
import { ApiError } from '@/types'

/**
 * Normalized application error
 */
export class AppError extends Error {
  constructor(
    public code: string,
    message: string,
    public statusCode?: number,
    public details?: Record<string, string[]>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

/**
 * Error codes for consistent handling
 */
export const ErrorCodes = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  SERVER_ERROR: 'SERVER_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes]

/**
 * Normalize any error into AppError
 */
export function normalizeError(error: unknown): AppError {
  // Axios errors
  if (error instanceof AxiosError) {
    const status = error.response?.status
    const apiError = error.response?.data as ApiError | undefined

    if (apiError) {
      return new AppError(
        apiError.code || ErrorCodes.UNKNOWN_ERROR,
        apiError.message || 'An error occurred',
        status,
        apiError.details
      )
    }

    // Network errors (no response)
    if (!error.response) {
      return new AppError(
        ErrorCodes.NETWORK_ERROR,
        'Network error. Please check your connection.',
        0
      )
    }

    // HTTP status based errors
    switch (status) {
      case 401:
        return new AppError(ErrorCodes.UNAUTHORIZED, 'Please sign in again', status)
      case 403:
        return new AppError(ErrorCodes.FORBIDDEN, 'You do not have permission', status)
      case 404:
        return new AppError(ErrorCodes.NOT_FOUND, 'Resource not found', status)
      case 422:
        return new AppError(ErrorCodes.VALIDATION_ERROR, 'Validation failed', status)
      case 500:
      default:
        return new AppError(ErrorCodes.SERVER_ERROR, 'Server error. Please try again later.', status)
    }
  }

  // Already normalized
  if (error instanceof AppError) {
    return error
  }

  // Unknown errors
  if (error instanceof Error) {
    return new AppError(ErrorCodes.UNKNOWN_ERROR, error.message)
  }

  return new AppError(ErrorCodes.UNKNOWN_ERROR, 'An unexpected error occurred')
}

/**
 * Get user-friendly error message
 */
export function getErrorMessage(error: unknown): string {
  const appError = normalizeError(error)
  return appError.message
}
