export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string
          apellidos: string
          telefono: string | null
          nivel_juego: 'principiante' | 'intermedio' | 'avanzado' | 'profesional' | null
          genero: 'masculino' | 'femenino' | 'otro' | null
          foto_perfil_url: string | null
          fecha_alta: string
          rol: 'user' | 'admin'
          stripe_customer_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name: string
          apellidos: string
          telefono?: string | null
          nivel_juego?: 'principiante' | 'intermedio' | 'avanzado' | 'profesional' | null
          genero?: 'masculino' | 'femenino' | 'otro' | null
          foto_perfil_url?: string | null
          fecha_alta?: string
          rol?: 'user' | 'admin'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string
          apellidos?: string
          telefono?: string | null
          nivel_juego?: 'principiante' | 'intermedio' | 'avanzado' | 'profesional' | null
          genero?: 'masculino' | 'femenino' | 'otro' | null
          foto_perfil_url?: string | null
          fecha_alta?: string
          rol?: 'user' | 'admin'
          stripe_customer_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      equipos: {
        Row: {
          id: string
          nombre: string
          categoria: 'mixto' | 'masculino' | 'femenino' | 'open'
          jugador1_id: string
          jugador2_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nombre: string
          categoria: 'mixto' | 'masculino' | 'femenino' | 'open'
          jugador1_id: string
          jugador2_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          categoria?: 'mixto' | 'masculino' | 'femenino' | 'open'
          jugador1_id?: string
          jugador2_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      eventos: {
        Row: {
          id: string
          tipo: 'torneo' | 'entrenamiento' | 'social'
          nombre: string
          descripcion: string | null
          fecha: string
          hora_inicio: string
          hora_fin: string | null
          ubicacion: string
          ubicacion_lat: number | null
          ubicacion_lng: number | null
          precio: number
          limite_plazas: number | null
          imagen_url: string | null
          es_competicion: boolean
          puntos_por_posicion: Json | null
          estado: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_by: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          tipo: 'torneo' | 'entrenamiento' | 'social'
          nombre: string
          descripcion?: string | null
          fecha: string
          hora_inicio: string
          hora_fin?: string | null
          ubicacion: string
          ubicacion_lat?: number | null
          ubicacion_lng?: number | null
          precio?: number
          limite_plazas?: number | null
          imagen_url?: string | null
          es_competicion?: boolean
          puntos_por_posicion?: Json | null
          estado?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          tipo?: 'torneo' | 'entrenamiento' | 'social'
          nombre?: string
          descripcion?: string | null
          fecha?: string
          hora_inicio?: string
          hora_fin?: string | null
          ubicacion?: string
          ubicacion_lat?: number | null
          ubicacion_lng?: number | null
          precio?: number
          limite_plazas?: number | null
          imagen_url?: string | null
          es_competicion?: boolean
          puntos_por_posicion?: Json | null
          estado?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
          created_by?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      inscripciones: {
        Row: {
          id: string
          evento_id: string
          usuario_id: string
          equipo_id: string | null
          estado_pago: 'pending' | 'completed' | 'failed' | 'refunded'
          metodo_pago: 'stripe' | 'cash' | 'transfer' | null
          stripe_payment_intent_id: string | null
          cantidad_pagada: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          evento_id: string
          usuario_id: string
          equipo_id?: string | null
          estado_pago?: 'pending' | 'completed' | 'failed' | 'refunded'
          metodo_pago?: 'stripe' | 'cash' | 'transfer' | null
          stripe_payment_intent_id?: string | null
          cantidad_pagada?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          evento_id?: string
          usuario_id?: string
          equipo_id?: string | null
          estado_pago?: 'pending' | 'completed' | 'failed' | 'refunded'
          metodo_pago?: 'stripe' | 'cash' | 'transfer' | null
          stripe_payment_intent_id?: string | null
          cantidad_pagada?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      resultados_torneos: {
        Row: {
          id: string
          evento_id: string
          equipo_id: string
          posicion: number
          puntos_ganados: number
          created_at: string
        }
        Insert: {
          id?: string
          evento_id: string
          equipo_id: string
          posicion: number
          puntos_ganados?: number
          created_at?: string
        }
        Update: {
          id?: string
          evento_id?: string
          equipo_id?: string
          posicion?: number
          puntos_ganados?: number
          created_at?: string
        }
      }
      ranking: {
        Row: {
          id: string
          temporada: string
          categoria: 'mixto' | 'masculino' | 'femenino' | 'open'
          jugador_id: string
          equipo_id: string | null
          puntos_totales: number
          torneos_jugados: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          temporada: string
          categoria: 'mixto' | 'masculino' | 'femenino' | 'open'
          jugador_id: string
          equipo_id?: string | null
          puntos_totales?: number
          torneos_jugados?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          temporada?: string
          categoria?: 'mixto' | 'masculino' | 'femenino' | 'open'
          jugador_id?: string
          equipo_id?: string | null
          puntos_totales?: number
          torneos_jugados?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
