import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { env } from '@config/env'
import { router } from './router'
import './styles/main.css'

function renderApp() {
  const container = document.getElementById('root')
  if (!container) {
    throw new Error('Root element not found')
  }

  createRoot(container).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  )
}

async function initMocks() {
  const { worker } = await import('./mocks/browser')
  await worker.start({
    onUnhandledRequest: 'bypass',
  })
}

Promise.resolve()
  .then(async () => {
    if (env.ENABLE_MOCKS) {
      await initMocks()
    }

    renderApp()
  })
  .catch((error) => {
    console.error('Initialization failed:', error)
    const root = document.getElementById('root')
    if (root) {
      root.innerHTML = `
        <div style="padding: 20px; color: red; font-family: sans-serif;">
          <h1>Failed to start app</h1>
          <pre>${error.message}</pre>
        </div>
      `
    }
  })
