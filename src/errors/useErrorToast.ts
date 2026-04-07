import { useCallback } from 'react'
import { normalizeError, getErrorMessage } from './error'

interface ToastOptions {
  duration?: number
  position?: 'top' | 'bottom'
}

/**
 * Hook for displaying error toast notifications
 * 
 * Note: This is a placeholder implementation. Integrate with your toast library
 * (e.g., Radix Toast, Sonner, react-hot-toast) as needed.
 */
export function useErrorToast() {
  const showError = useCallback((error: unknown, _options?: ToastOptions) => {
    const message = getErrorMessage(error)
    const normalized = normalizeError(error)

    // TODO: Replace with actual toast implementation
    console.error('[ErrorToast]', normalized.code, message)
    
    // Placeholder: alert for now
    if (import.meta.env.DEV) {
      alert(`Error: ${message}`)
    }
  }, [])

  const showSuccess = useCallback((message: string, _options?: ToastOptions) => {
    // TODO: Replace with actual toast implementation
    console.log('[SuccessToast]', message)
  }, [])

  return { showError, showSuccess }
}
