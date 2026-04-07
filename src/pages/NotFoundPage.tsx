import { useNavigate } from 'react-router-dom'
import { Button } from '@components/ui/Button'
import { Home, AlertTriangle } from 'lucide-react'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="mb-2 text-4xl font-bold">404</h1>
        <p className="mb-2 text-xl font-semibold">Page not found</p>
        <p className="mb-8 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Button onClick={() => navigate('/')}>
          <Home className="mr-2 h-4 w-4" />
          Back to home
        </Button>
      </div>
    </div>
  )
}
