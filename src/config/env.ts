export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  ENABLE_MOCKS: import.meta.env.VITE_ENABLE_MOCKS !== 'false',
  USE_PASSKEY_STUB: import.meta.env.VITE_USE_PASSKEY_STUB === 'true',
} as const

export type Env = typeof env
