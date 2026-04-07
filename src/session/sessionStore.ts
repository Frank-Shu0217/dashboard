import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { User } from '@/types'
import { setAccessToken } from '@api/apiClient'

interface SessionState {
  user: User | null
  accessToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
  passwordFailedAttempts: number
  passwordLocked: boolean
  setUser: (user: User | null) => void
  setAccessTokenValue: (accessToken: string | null) => void
  setAuthenticated: (value: boolean) => void
  setLoading: (value: boolean) => void
  login: (user: User, accessToken: string) => void
  recordPasswordFailure: () => number
  resetPasswordFailures: () => void
  logout: () => void
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,
      passwordFailedAttempts: 0,
      passwordLocked: false,

      setUser: (user) => set({ user }),
      setAccessTokenValue: (accessToken) => {
        setAccessToken(accessToken)
        set({ accessToken })
      },
      setAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setLoading: (isLoading) => set({ isLoading }),

      login: (user, accessToken) => {
        setAccessToken(accessToken)
        set({
          user,
          accessToken,
          isAuthenticated: true,
          isLoading: false,
          passwordFailedAttempts: 0,
          passwordLocked: false,
        })
      },

      recordPasswordFailure: () => {
        let nextAttempts = 1
        set((state) => {
          nextAttempts = state.passwordFailedAttempts + 1
          return {
            passwordFailedAttempts: nextAttempts,
            passwordLocked: nextAttempts >= 3,
          }
        })
        return nextAttempts
      },

      resetPasswordFailures: () => {
        set({ passwordFailedAttempts: 0, passwordLocked: false })
      },

      logout: () => {
        setAccessToken(null)
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        })
      },
    }),
    {
      name: 'session-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        passwordFailedAttempts: state.passwordFailedAttempts,
        passwordLocked: state.passwordLocked,
      }),
      onRehydrateStorage: () => (state) => {
        const hydratedToken = state?.accessToken ?? null
        setAccessToken(hydratedToken)

        if (state) {
          state.isAuthenticated = Boolean(state.user && hydratedToken)
          state.isLoading = false
        }
      },
    }
  )
)

export const useUser = () => useSessionStore((state) => state.user)
export const useStoredAccessToken = () => useSessionStore((state) => state.accessToken)
export const useIsAuthenticated = () => useSessionStore((state) => state.isAuthenticated)
export const useIsLoading = () => useSessionStore((state) => state.isLoading)
