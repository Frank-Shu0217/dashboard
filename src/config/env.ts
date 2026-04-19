const configuredApiUrl = import.meta.env.VITE_API_URL
const shouldUseDevProxy =
  import.meta.env.DEV &&
  typeof window !== 'undefined' &&
  window.location.protocol === 'https:' &&
  !configuredApiUrl

export const env = {
  API_URL: shouldUseDevProxy ? '' : configuredApiUrl || 'http://macbookserver.dev:8080',
  ENABLE_MOCKS: import.meta.env.VITE_ENABLE_MOCKS !== 'false',
} as const

export type Env = typeof env
