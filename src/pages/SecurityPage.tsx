import { useCallback, useEffect, useState } from 'react'
import { apiClient } from '@api/apiClient'
import { useAuth } from '@auth/useAuth'
import { useUser } from '@session/sessionStore'
import { Check, KeyRound, Loader2, ShieldCheck, Trash2 } from 'lucide-react'

interface PasskeySummary {
  credentialId: string
  createdAt: string
  lastUsedAt: string
  signatureCount: number
}

export default function SecurityPage() {
  const user = useUser()
  const { register, isLoading } = useAuth()
  const [passkeys, setPasskeys] = useState<PasskeySummary[]>([])
  const [isPasskeysLoading, setIsPasskeysLoading] = useState(false)
  const [deletingCredentialId, setDeletingCredentialId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const loadPasskeys = useCallback(async () => {
    setIsPasskeysLoading(true)
    try {
      const { data } = await apiClient.get<{ passkeys: PasskeySummary[] }>('/auth/passkeys')
      setPasskeys(data.passkeys)
    } catch {
      setPasskeys([])
    } finally {
      setIsPasskeysLoading(false)
    }
  }, [])

  useEffect(() => {
    loadPasskeys()
  }, [loadPasskeys])

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
      await loadPasskeys()
      return
    }

    setError(result.error || 'Passkey registration failed.')
  }

  const handleDeletePasskey = async (credentialId: string) => {
    const confirmed = window.confirm('Delete this passkey from the backend credential store?')
    if (!confirmed) {
      return
    }

    setMessage(null)
    setError(null)
    setDeletingCredentialId(credentialId)
    try {
      await apiClient.delete(`/auth/passkeys/${encodeURIComponent(credentialId)}`)
      setMessage('Passkey deleted from the backend credential store.')
      await loadPasskeys()
    } catch {
      setError('Passkey deletion failed.')
    } finally {
      setDeletingCredentialId(null)
    }
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

          <div className="mt-6 border-t border-border pt-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="font-medium">Registered passkeys</h3>
                <p className="text-sm text-muted-foreground">
                  {passkeys.length} passkey{passkeys.length === 1 ? '' : 's'} registered for this account.
                </p>
              </div>
              {isPasskeysLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
            </div>

            {passkeys.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border px-4 py-6 text-sm text-muted-foreground">
                No passkey has been registered yet.
              </div>
            ) : (
              <div className="space-y-3">
                {passkeys.map((passkey) => (
                  <div key={passkey.credentialId} className="rounded-lg border border-border px-4 py-3 text-sm">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium">Passkey</p>
                        <p className="mt-1 break-all text-xs text-muted-foreground">{passkey.credentialId}</p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <span className="rounded-md bg-brand/10 px-2 py-1 text-xs font-medium text-brand">
                          Active
                        </span>
                        <button
                          type="button"
                          className="btn-secondary px-2 py-1 text-xs text-destructive"
                          disabled={deletingCredentialId === passkey.credentialId}
                          onClick={() => handleDeletePasskey(passkey.credentialId)}
                        >
                          {deletingCredentialId === passkey.credentialId ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="h-3.5 w-3.5" />
                          )}
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-3 grid gap-2 text-xs text-muted-foreground sm:grid-cols-2">
                      <p>Created: {new Date(passkey.createdAt).toLocaleString()}</p>
                      <p>
                        Last used:{' '}
                        {passkey.lastUsedAt ? new Date(passkey.lastUsedAt).toLocaleString() : 'Not used yet'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
