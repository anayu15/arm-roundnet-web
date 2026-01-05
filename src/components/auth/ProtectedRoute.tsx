import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { LoadingSpinner } from '@/components/shared/LoadingSpinner'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

/**
 * Wrapper component to protect routes that require authentication
 * Optionally can require admin role
 */
export const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const location = useLocation()

  // Show loading spinner while checking auth state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // Redirect to home if admin is required but user is not admin
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
