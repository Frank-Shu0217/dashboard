import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import { existsSync, readFileSync } from 'fs'

const certPath = process.env.VITE_DEV_HTTPS_CERT || '/Users/frank/certs/macbookserver.dev+3.pem'
const keyPath = process.env.VITE_DEV_HTTPS_KEY || '/Users/frank/certs/macbookserver.dev+3-key.pem'
const useHttps = process.env.VITE_DEV_HTTPS === 'true'
const httpsConfig = useHttps && existsSync(certPath) && existsSync(keyPath)
  ? {
      cert: readFileSync(certPath),
      key: readFileSync(keyPath),
    }
  : undefined

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@auth': resolve(__dirname, './src/auth'),
      '@api': resolve(__dirname, './src/api'),
      '@components': resolve(__dirname, './src/components'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@session': resolve(__dirname, './src/session'),
      '@errors': resolve(__dirname, './src/errors'),
      '@config': resolve(__dirname, './src/config'),
      '@utils': resolve(__dirname, './src/utils'),
      '@types': resolve(__dirname, './src/types'),
      '@hooks': resolve(__dirname, './src/hooks'),
    },
  },
  server: {
    port: 3000,
    host: true,
    allowedHosts: ['macbookserver.dev', 'jokingly-hazelnut-badge.ngrok-free.dev'],
    https: httpsConfig,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://macbookserver.dev:8080',
        changeOrigin: true,
      },
      '/auth': {
        target: process.env.VITE_API_URL || 'http://macbookserver.dev:8080',
        changeOrigin: true,
      },
    },
  },
  build: {
    target: 'es2022',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          auth: ['@simplewebauthn/browser'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-toast', '@radix-ui/react-dropdown-menu'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        'src/mocks/',
        'src/**/*.d.ts',
      ],
    },
  },
})
