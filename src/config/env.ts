export const env = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
  ENABLE_MOCKS: import.meta.env.VITE_ENABLE_MOCKS !== 'false',
} as const

export type Env = typeof env
