import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@auth/useAuth'
import { useSessionStore } from '@session/sessionStore'
import { apiClient } from '@api/apiClient'
import { AlertTriangle, Eye, EyeOff, Fingerprint, Loader2, Lock, LogIn, User } from 'lucide-react'

const rememberedUserIdKey = 'dashboard.rememberedUserId'

type PasswordCredentialConstructor = new (form: HTMLFormElement) => Credential
type WindowWithPasswordCredential = Window & {
  PasswordCredential?: PasswordCredentialConstructor
}

function readRememberedUserId() {
  try {
    return window.localStorage.getItem(rememberedUserIdKey) ?? ''
  } catch {
    return ''
  }
}

function writeRememberedUserId(username: string) {
  try {
    window.localStorage.setItem(rememberedUserIdKey, username)
  } catch {
    // Browser storage may be unavailable in restricted modes.
  }
}

function removeRememberedUserId() {
  try {
    window.localStorage.removeItem(rememberedUserIdKey)
  } catch {
    // Browser storage may be unavailable in restricted modes.
  }
}

async function storePasswordWithBrowser(form: HTMLFormElement | null) {
  const PasswordCredential = (window as WindowWithPasswordCredential).PasswordCredential

  if (!form || !PasswordCredential || !navigator.credentials?.store) {
    return
  }

  try {
    await navigator.credentials.store(new PasswordCredential(form))
  } catch {
    // The browser or user may decline password-manager storage.
  }
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { authenticate, isLoading: authLoading } = useAuth()
  const login = useSessionStore((state) => state.login)
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated)
  const passwordLocked = useSessionStore((state) => state.passwordLocked)
  const passwordFailedAttempts = useSessionStore((state) => state.passwordFailedAttempts)
  const recordPasswordFailure = useSessionStore((state) => state.recordPasswordFailure)
  const resetPasswordFailures = useSessionStore((state) => state.resetPasswordFailures)
  const [username, setUsername] = useState(readRememberedUserId)
  const [password, setPassword] = useState('')
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [rememberUserId, setRememberUserId] = useState(() => Boolean(readRememberedUserId()))
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [passkeyError, setPasskeyError] = useState<string | null>(null)
  const [isPasswordLoading, setIsPasswordLoading] = useState(false)

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, navigate])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextUsername = e.target.value
    setUsername(nextUsername)

    if (rememberUserId) {
      writeRememberedUserId(nextUsername)
    }
  }

  const handleRememberUserIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const shouldRemember = e.target.checked
    setRememberUserId(shouldRemember)

    if (shouldRemember) {
      writeRememberedUserId(username)
      return
    }

    removeRememberedUserId()
  }

  const handlePasswordLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const loginForm = e.currentTarget

    if (passwordLocked) {
      navigate('/error/login')
      return
    }

    setPasswordError(null)
    setPasskeyError(null)
    setIsPasswordLoading(true)

    try {
      const response = await apiClient.post('/auth/login/password', {
        username,
        password,
      })

      const { user, accessToken } = response.data
      if (rememberUserId) {
        writeRememberedUserId(username)
      } else {
        removeRememberedUserId()
      }
      resetPasswordFailures()
      login(user, accessToken)
      await storePasswordWithBrowser(loginForm)
      navigate('/dashboard')
    } catch (error: unknown) {
      const nextAttempts = recordPasswordFailure()
      const message =
        typeof error === 'object' &&
        error !== null &&
        'response' in error &&
        typeof error.response === 'object' &&
        error.response !== null &&
        'data' in error.response &&
        typeof error.response.data === 'object' &&
        error.response.data !== null &&
        'message' in error.response.data
          ? String(error.response.data.message)
          : 'Login failed'

      if (nextAttempts >= 3) {
        navigate('/error/login')
        return
      }

      setPasswordError(`${message}. ${3 - nextAttempts} attempt(s) remaining.`)
    } finally {
      setIsPasswordLoading(false)
    }
  }

  const handlePasskey = async () => {
    setPasswordError(null)
    setPasskeyError(null)

    const result = await authenticate()
    if (!result.success) {
      setPasskeyError(result.error || 'Passkey login failed')
      return
    }

    navigate('/dashboard')
  }

  const loading = isPasswordLoading || authLoading
  const remainingAttempts = Math.max(0, 3 - passwordFailedAttempts)

  return (
    <div className="space-y-6 rounded-[1.5rem] border border-white/70 bg-white/90 p-6 shadow-xl shadow-slate-900/5 backdrop-blur sm:p-8">
      <div className="space-y-2 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.24em] text-brand">Secure Login</p>
        <h2 className="text-2xl font-semibold">Sign in to Dashboard</h2>
        <p className="text-sm text-muted-foreground">
          Use passkey first. Password login remains available as a fallback.
        </p>
      </div>

      <div className="rounded-2xl bg-slate-950 px-5 py-6 text-white">
        <div className="mb-4 flex items-start gap-3">
          <div className="rounded-full bg-white/10 p-2">
            <Fingerprint className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium">Passkey login</h3>
            <p className="mt-1 text-sm text-slate-300">
              Primary authentication for desktop and mobile browsers.
            </p>
          </div>
        </div>

        <button
          type="button"
          disabled={loading}
          onClick={handlePasskey}
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-slate-950 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {authLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Fingerprint className="h-4 w-4" />}
          Sign in with Passkey
        </button>

        {passkeyError && <p className="mt-3 text-sm text-red-200">{passkeyError}</p>}
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <form
        onSubmit={handlePasswordLogin}
        className="space-y-4"
        method="post"
        action="/auth/login/password"
        autoComplete="on"
      >
        <div>
          <label htmlFor="username" className="mb-1.5 block text-sm font-medium">
            User ID
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="username"
              name="username"
              type="text"
              value={username}
              onChange={handleUsernameChange}
              placeholder="tester1"
              autoComplete="username"
              className="input-field pl-10"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              name="password"
              type={isPasswordVisible ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              autoComplete="current-password"
              className="input-field pl-10 pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setIsPasswordVisible((visible) => !visible)}
              className="absolute right-2 top-1/2 inline-flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
              aria-pressed={isPasswordVisible}
            >
              {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={rememberUserId}
            onChange={handleRememberUserIdChange}
            className="h-4 w-4 rounded border-border text-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
          />
          Remember user ID
        </label>

        {(passwordError || passwordLocked) && (
          <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <p>{passwordError || 'Password login is locked for this browser session.'}</p>
              {!passwordLocked && remainingAttempts > 0 && (
                <p className="mt-1 text-red-600">{remainingAttempts} attempt(s) remaining.</p>
              )}
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || passwordLocked}
          className="btn-primary w-full"
        >
          {isPasswordLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
          Sign in with User ID / Password
        </button>

        <p className="text-center text-xs text-muted-foreground">
          Mock account: <strong>tester1</strong> / <strong>p0ssw0rd</strong>
        </p>
      </form>
    </div>
  )
}
