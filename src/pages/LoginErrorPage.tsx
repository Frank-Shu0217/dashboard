import { Link } from 'react-router-dom'
import { AlertTriangle } from 'lucide-react'

export default function LoginErrorPage() {
  return (
    <div className="rounded-[1.5rem] border border-white/70 bg-white/90 p-6 text-center shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8">
      <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-600">
        <AlertTriangle className="h-6 w-6" />
      </div>

      <h1 className="text-2xl font-semibold">Login error</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        The maximum number of password login attempts was reached for this browser session.
        Passkey login remains available when you return to the login page.
      </p>

      <Link to="/login" className="btn-primary mt-6 w-full">
        Return to login
      </Link>
    </div>
  )
}
