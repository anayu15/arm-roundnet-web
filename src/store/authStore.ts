import { create } from 'zustand'
import { supabase } from '@/lib/supabase'
import { authService } from '@/services/auth.service'
import type { AuthState, User, UserProfile } from '@/types/auth.types'

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  isAuthenticated: false,
  isLoading: true,

  /**
   * Initialize auth state and set up auth listener
   * Should be called once when the app starts
   */
  initialize: async () => {
    try {
      set({ isLoading: true })

      // Get current session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()

      if (sessionError) {
        console.error('Session error:', sessionError)
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false })
        return
      }

      if (session?.user) {
        // Get user profile
        const { profile } = await authService.getUserProfile(session.user.id)

        set({
          user: { ...session.user, profile: profile || undefined } as User,
          profile,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        set({ user: null, profile: null, isAuthenticated: false, isLoading: false })
      }

      // Set up auth state change listener
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)

        if (event === 'SIGNED_IN' && session?.user) {
          // User signed in - fetch profile
          const { profile } = await authService.getUserProfile(session.user.id)

          set({
            user: { ...session.user, profile: profile || undefined } as User,
            profile,
            isAuthenticated: true,
            isLoading: false,
          })
        } else if (event === 'SIGNED_OUT') {
          // User signed out - clear state
          set({
            user: null,
            profile: null,
            isAuthenticated: false,
            isLoading: false,
          })
        } else if (event === 'TOKEN_REFRESHED' && session?.user) {
          // Token refreshed - update user but keep profile
          const currentProfile = get().profile

          set({
            user: { ...session.user, profile: currentProfile || undefined } as User,
          })
        } else if (event === 'USER_UPDATED' && session?.user) {
          // User data updated - refetch profile
          const { profile } = await authService.getUserProfile(session.user.id)

          set({
            user: { ...session.user, profile: profile || undefined } as User,
            profile,
          })
        }
      })
    } catch (error) {
      console.error('Initialize auth error:', error)
      set({ user: null, profile: null, isAuthenticated: false, isLoading: false })
    }
  },

  /**
   * Sign out the current user
   */
  logout: async () => {
    try {
      const { error } = await authService.signOut()

      if (error) {
        console.error('Logout error:', error)
        throw error
      }

      // State will be updated by the onAuthStateChange listener
    } catch (error) {
      console.error('Logout error:', error)
      throw error
    }
  },

  /**
   * Update user profile in the store
   * Used after profile updates
   */
  updateProfile: (profile: UserProfile | null) => {
    const currentUser = get().user

    if (currentUser && profile) {
      set({
        profile,
        user: { ...currentUser, profile } as User,
      })
    } else if (!profile) {
      set({ profile: null })
    }
  },
}))
