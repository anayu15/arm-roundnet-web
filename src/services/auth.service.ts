import { supabase } from '@/lib/supabase'
import type { SignUpData, SignInData, UpdateProfileData, UserProfile } from '@/types/auth.types'

export const authService = {
  /**
   * Sign up a new user and create their profile
   */
  async signUp(data: SignUpData) {
    try {
      // Create auth user with metadata
      // The database trigger will automatically create the profile in public.users
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            nombre_completo: data.nombre_completo,
            genero: data.genero,
            telefono: data.telefono || null,
          },
        },
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned from sign up')

      return { user: authData.user, error: null }
    } catch (error) {
      console.error('Sign up error:', error)
      return { user: null, error: error as Error }
    }
  },

  /**
   * Sign in with email and password
   */
  async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) throw error

      return { user: authData.user, error: null }
    } catch (error) {
      console.error('Sign in error:', error)
      return { user: null, error: error as Error }
    }
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Sign out error:', error)
      return { error: error as Error }
    }
  },

  /**
   * Send password recovery email
   */
  async resetPassword(email: string) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Password reset error:', error)
      return { error: error as Error }
    }
  },

  /**
   * Update password (for password reset flow)
   */
  async updatePassword(newPassword: string) {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error
      return { error: null }
    } catch (error) {
      console.error('Update password error:', error)
      return { error: error as Error }
    }
  },

  /**
   * Get current user profile from public.users
   */
  async getUserProfile(userId: string): Promise<{ profile: UserProfile | null; error: Error | null }> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) throw error

      return { profile: data, error: null }
    } catch (error) {
      console.error('Get user profile error:', error)
      return { profile: null, error: error as Error }
    }
  },

  /**
   * Update user profile
   */
  async updateUserProfile(userId: string, updates: UpdateProfileData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return { profile: data, error: null }
    } catch (error) {
      console.error('Update profile error:', error)
      return { profile: null, error: error as Error }
    }
  },

  /**
   * Upload profile image to Supabase Storage
   */
  async uploadProfileImage(userId: string, file: File) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const filePath = `profile-images/${fileName}`

      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        })

      if (uploadError) throw uploadError

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      // Update profile with new image URL
      const { error: updateError } = await supabase
        .from('users')
        .update({ foto_perfil_url: urlData.publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      return { url: urlData.publicUrl, error: null }
    } catch (error) {
      console.error('Upload profile image error:', error)
      return { url: null, error: error as Error }
    }
  },

  /**
   * Check if user is admin
   */
  async isAdmin(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('rol')
        .eq('id', userId)
        .single()

      if (error) throw error

      return data?.rol === 'admin'
    } catch (error) {
      console.error('Check admin error:', error)
      return false
    }
  },
}
