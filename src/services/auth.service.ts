import { supabase } from '@/lib/supabase'
import type { SignUpData, SignInData, UpdateProfileData, UserProfile } from '@/types/auth.types'

export const authService = {
  /**
   * Sign up a new user and create their profile
   */
  async signUp(data: SignUpData) {
    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      })

      if (authError) throw authError
      if (!authData.user) throw new Error('No user returned from sign up')

      // 2. Create user profile in public.users table
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email: data.email,
          name: data.name,
          apellidos: data.apellidos,
          nivel_juego: data.nivel_juego,
          genero: data.genero,
          telefono: data.telefono || null,
          rol: 'user',
        })

      if (profileError) {
        // If profile creation fails, try to delete the auth user
        await supabase.auth.admin.deleteUser(authData.user.id).catch(() => {
          // Ignore error if we can't delete the auth user
        })
        throw profileError
      }

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
