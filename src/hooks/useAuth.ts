import { useAuthStore } from '@/store/authStore'

/**
 * Hook to access authentication state and methods
 * This is a convenience wrapper around the auth store
 */
export const useAuth = () => {
  const { user, profile, isAuthenticated, isLoading, logout } = useAuthStore()

  return {
    user,
    profile,
    isAuthenticated,
    isLoading,
    logout,
    isAdmin: profile?.rol === 'admin',
  }
}
