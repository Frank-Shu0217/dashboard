import { useState } from 'react'
import { useAuth } from '@auth/useAuth'
import { useUser } from '@session/sessionStore'
import { Check, KeyRound, Loader2, ShieldCheck } from 'lucide-react'

export default function SecurityPage() {
  const user = useUser()
  const { register, isLoading } = useAuth()
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCreatePasskey = async () => {
    if (!user?.email) {
      setError('Sign in before creating a passkey.')
      return
    }

    setMessage(null)
    setError(null)
    const result = await register({ email: user.email })
    if (result.success) {
      setMessage('Passkey created for this account.')
      return
    }

    setError(result.error || 'Passkey registration failed.')
  }

  return (
    <div className="flex h-full flex-col">
      <div className="sticky top-0 z-10 border-b bg-background px-4 py-4">
        <div>
          <h1 className="text-xl font-semibold">Security</h1>
          <p className="mt-1 text-sm text-muted-foreground">Create a passkey for faster sign-in.</p>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="card mx-auto max-w-2xl">
          <div className="mb-6 flex items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand/10">
              <ShieldCheck className="h-5 w-5 text-brand" />
            </div>
            <div>
              <h2 className="font-medium">Passkey sign-in</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Your device creates and protects the private key. The server stores only the public credential.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <p className="text-muted-foreground">Account</p>
                <p className="font-medium">{user?.name || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Email</p>
                <p className="font-medium">{user?.email || '-'}</p>
              </div>
            </div>
          </div>

          {message && (
            <div className="mt-4 flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              <Check className="mt-0.5 h-4 w-4 shrink-0" />
              <p>{message}</p>
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-6 border-t border-border pt-4">
            <button type="button" onClick={handleCreatePasskey} className="btn-primary" disabled={isLoading}>
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              Create passkey
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
