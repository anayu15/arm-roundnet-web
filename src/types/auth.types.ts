import type { User as SupabaseUser } from '@supabase/supabase-js'
import type { Database } from './database.types'

export type UserProfile = Database['public']['Tables']['users']['Row']

export interface User extends SupabaseUser {
  profile?: UserProfile
}

export interface SignUpData {
  email: string
  password: string
  nombre_completo: string
  genero: 'masculino' | 'femenino' | 'otro'
  telefono?: string
}

export interface SignInData {
  email: string
  password: string
}

export interface UpdateProfileData {
  nombre_completo?: string
  telefono?: string
  genero?: 'masculino' | 'femenino' | 'otro'
  foto_perfil_url?: string
}

export interface AuthState {
  user: User | null
  profile: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  initialize: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: UserProfile | null) => void
}
