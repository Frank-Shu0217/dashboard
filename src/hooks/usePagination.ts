import { useState, useCallback } from 'react'

interface UsePaginationOptions {
  initialPage?: number
  initialLimit?: number
}

interface UsePaginationReturn {
  page: number
  limit: number
  setPage: (page: number) => void
  setLimit: (limit: number) => void
  nextPage: () => void
  prevPage: () => void
  reset: () => void
  offset: number
}

/**
 * Hook for managing pagination state
 */
export function usePagination(options: UsePaginationOptions = {}): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10 } = options

  const [page, setPageState] = useState(initialPage)
  const [limit, setLimit] = useState(initialLimit)

  const setPage = useCallback((newPage: number) => {
    setPageState(Math.max(1, newPage))
  }, [])

  const nextPage = useCallback(() => {
    setPageState((prev) => prev + 1)
  }, [])

  const prevPage = useCallback(() => {
    setPageState((prev) => Math.max(1, prev - 1))
  }, [])

  const reset = useCallback(() => {
    setPageState(initialPage)
    setLimit(initialLimit)
  }, [initialPage, initialLimit])

  const offset = (page - 1) * limit

  return {
    page,
    limit,
    setPage,
    setLimit,
    nextPage,
    prevPage,
    reset,
    offset,
  }
}
