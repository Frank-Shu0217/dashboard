import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(39,136,255,0.18),_transparent_32%),linear-gradient(180deg,_#f8fbff_0%,_#eef4fb_100%)] lg:grid-cols-2">
      <div className="hidden items-center justify-center p-12 lg:flex">
        <div className="max-w-md rounded-[2rem] bg-slate-900 px-10 py-12 text-white shadow-2xl">
          <p className="mb-4 text-sm uppercase tracking-[0.24em] text-sky-200">Dashboard</p>
          <h1 className="mb-4 text-4xl font-bold">Secure access for people, companies, and reports.</h1>
          <p className="text-lg text-slate-300">
            Passkey sign-in is the primary flow. Password login remains available as a controlled fallback.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center lg:hidden">
            <h1 className="text-2xl font-bold text-brand">Dashboard</h1>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
