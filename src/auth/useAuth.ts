import { useCallback, useState } from 'react'
import { startRegistration, startAuthentication } from '@simplewebauthn/browser'
import { apiClient } from '@api/apiClient'
import { useSessionStore } from '@session/sessionStore'
import { normalizeError } from '@errors/error'
import { env } from '@config/env'
import type {
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/types'

interface AuthOptions {
  email: string
}

interface AuthResult {
  success: boolean
  error?: string
}

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useSessionStore()

  const register = useCallback(async (options: AuthOptions): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      const { data: optionsJSON } = await apiClient.post<PublicKeyCredentialCreationOptionsJSON>(
        '/auth/register/options',
        { email: options.email }
      )

      const attestation = await startRegistration(optionsJSON)
      const { data } = await apiClient.post('/auth/register/verify', {
        email: options.email,
        attestation,
      })

      login(data.user, data.accessToken)
      return { success: true }
    } catch (error) {
      const appError = normalizeError(error)
      return { success: false, error: appError.message }
    } finally {
      setIsLoading(false)
    }
  }, [login])

  const authenticate = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true)
    try {
      if (env.ENABLE_MOCKS) {
        const { data } = await apiClient.post('/auth/login/passkey')
        login(data.user, data.accessToken)
        return { success: true }
      }

      const { data: optionsJSON } = await apiClient.post<PublicKeyCredentialRequestOptionsJSON>(
        '/auth/login/options'
      )

      const assertion = await startAuthentication(optionsJSON)
      const { data } = await apiClient.post('/auth/login/verify', { assertion })
      login(data.user, data.accessToken)

      return { success: true }
    } catch (error) {
      const appError = normalizeError(error)
      return { success: false, error: appError.message }
    } finally {
      setIsLoading(false)
    }
  }, [login])

  return {
    register,
    authenticate,
    isLoading,
  }
}
