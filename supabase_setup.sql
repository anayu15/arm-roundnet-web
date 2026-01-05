-- ============================================
-- SUPABASE SETUP SCRIPT FOR ARM WEB APP
-- Asociación Roundnet Madrid
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

-- Users table (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  apellidos TEXT NOT NULL,
  telefono TEXT,
  nivel_juego TEXT CHECK (nivel_juego IN ('principiante', 'intermedio', 'avanzado', 'profesional')),
  genero TEXT CHECK (genero IN ('masculino', 'femenino', 'otro')),
  foto_perfil_url TEXT,
  fecha_alta TIMESTAMPTZ DEFAULT NOW(),
  rol TEXT DEFAULT 'user' CHECK (rol IN ('user', 'admin')),
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Equipos (Teams) table
CREATE TABLE IF NOT EXISTS public.equipos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  nombre TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('mixto', 'masculino', 'femenino', 'open')),
  jugador1_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  jugador2_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT different_players CHECK (jugador1_id != jugador2_id)
);

-- Eventos (Events) table
CREATE TABLE IF NOT EXISTS public.eventos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tipo TEXT NOT NULL CHECK (tipo IN ('torneo', 'entrenamiento', 'social')),
  nombre TEXT NOT NULL,
  descripcion TEXT,
  fecha DATE NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME,
  ubicacion TEXT NOT NULL,
  ubicacion_lat NUMERIC(10, 8),
  ubicacion_lng NUMERIC(11, 8),
  precio NUMERIC(10, 2) DEFAULT 0,
  limite_plazas INTEGER,
  imagen_url TEXT,
  es_competicion BOOLEAN DEFAULT FALSE,
  puntos_por_posicion JSONB,
  estado TEXT DEFAULT 'upcoming' CHECK (estado IN ('upcoming', 'ongoing', 'completed', 'cancelled')),
  created_by UUID REFERENCES public.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Inscripciones (Registrations) table
CREATE TABLE IF NOT EXISTS public.inscripciones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
  estado_pago TEXT DEFAULT 'pending' CHECK (estado_pago IN ('pending', 'completed', 'failed', 'refunded')),
  metodo_pago TEXT CHECK (metodo_pago IN ('stripe', 'cash', 'transfer')),
  stripe_payment_intent_id TEXT,
  cantidad_pagada NUMERIC(10, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(evento_id, usuario_id)
);

-- Resultados Torneos (Tournament Results) table
CREATE TABLE IF NOT EXISTS public.resultados_torneos (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  evento_id UUID REFERENCES public.eventos(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE CASCADE,
  posicion INTEGER NOT NULL,
  puntos_ganados INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(evento_id, equipo_id)
);

-- Ranking table
CREATE TABLE IF NOT EXISTS public.ranking (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  temporada TEXT NOT NULL,
  categoria TEXT NOT NULL CHECK (categoria IN ('mixto', 'masculino', 'femenino', 'open')),
  jugador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
  puntos_totales INTEGER DEFAULT 0,
  torneos_jugados INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(temporada, categoria, jugador_id)
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_eventos_fecha ON public.eventos(fecha DESC);
CREATE INDEX IF NOT EXISTS idx_eventos_tipo ON public.eventos(tipo);
CREATE INDEX IF NOT EXISTS idx_eventos_estado ON public.eventos(estado);
CREATE INDEX IF NOT EXISTS idx_inscripciones_evento ON public.inscripciones(evento_id);
CREATE INDEX IF NOT EXISTS idx_inscripciones_usuario ON public.inscripciones(usuario_id);
CREATE INDEX IF NOT EXISTS idx_ranking_temporada_categoria ON public.ranking(temporada, categoria, puntos_totales DESC);
CREATE INDEX IF NOT EXISTS idx_equipos_jugadores ON public.equipos(jugador1_id, jugador2_id);

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_equipos_updated_at ON public.equipos;
CREATE TRIGGER update_equipos_updated_at BEFORE UPDATE ON public.equipos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_eventos_updated_at ON public.eventos;
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON public.eventos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_inscripciones_updated_at ON public.inscripciones;
CREATE TRIGGER update_inscripciones_updated_at BEFORE UPDATE ON public.inscripciones
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_ranking_updated_at ON public.ranking;
CREATE TRIGGER update_ranking_updated_at BEFORE UPDATE ON public.ranking
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eventos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inscripciones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resultados_torneos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ranking ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Anyone can view teams" ON public.equipos;
DROP POLICY IF EXISTS "Users can create teams if they are a member" ON public.equipos;
DROP POLICY IF EXISTS "Team members can update their team" ON public.equipos;
DROP POLICY IF EXISTS "Anyone can view events" ON public.eventos;
DROP POLICY IF EXISTS "Admins can create events" ON public.eventos;
DROP POLICY IF EXISTS "Admins can update events" ON public.eventos;
DROP POLICY IF EXISTS "Admins can delete events" ON public.eventos;
DROP POLICY IF EXISTS "Users can view their own registrations" ON public.inscripciones;
DROP POLICY IF EXISTS "Admins can view all registrations" ON public.inscripciones;
DROP POLICY IF EXISTS "Users can create their own registrations" ON public.inscripciones;
DROP POLICY IF EXISTS "Users can update their own registrations" ON public.inscripciones;
DROP POLICY IF EXISTS "Admins can update all registrations" ON public.inscripciones;
DROP POLICY IF EXISTS "Anyone can view ranking" ON public.ranking;
DROP POLICY IF EXISTS "Anyone can view tournament results" ON public.resultados_torneos;
DROP POLICY IF EXISTS "Admins can manage tournament results" ON public.resultados_torneos;

-- Users policies
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Equipos policies
CREATE POLICY "Anyone can view teams" ON public.equipos
  FOR SELECT USING (true);

CREATE POLICY "Users can create teams if they are a member" ON public.equipos
  FOR INSERT WITH CHECK (auth.uid() = jugador1_id OR auth.uid() = jugador2_id);

CREATE POLICY "Team members can update their team" ON public.equipos
  FOR UPDATE USING (auth.uid() = jugador1_id OR auth.uid() = jugador2_id);

-- Eventos policies
CREATE POLICY "Anyone can view events" ON public.eventos
  FOR SELECT USING (true);

CREATE POLICY "Admins can create events" ON public.eventos
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "Admins can update events" ON public.eventos
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "Admins can delete events" ON public.eventos
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
  );

-- Inscripciones policies
CREATE POLICY "Users can view their own registrations" ON public.inscripciones
  FOR SELECT USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can view all registrations" ON public.inscripciones
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
  );

CREATE POLICY "Users can create their own registrations" ON public.inscripciones
  FOR INSERT WITH CHECK (auth.uid() = usuario_id);

CREATE POLICY "Users can update their own registrations" ON public.inscripciones
  FOR UPDATE USING (auth.uid() = usuario_id);

CREATE POLICY "Admins can update all registrations" ON public.inscripciones
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
  );

-- Ranking & Results policies
CREATE POLICY "Anyone can view ranking" ON public.ranking
  FOR SELECT USING (true);

CREATE POLICY "Anyone can view tournament results" ON public.resultados_torneos
  FOR SELECT USING (true);

CREATE POLICY "Admins can manage tournament results" ON public.resultados_torneos
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND rol = 'admin')
  );

-- ============================================
-- SUCCESS MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ ARM Database setup completed successfully!';
  RAISE NOTICE '📊 Tables created: 6';
  RAISE NOTICE '🔐 RLS policies applied: 15';
  RAISE NOTICE '⚡ Indexes created: 7';
  RAISE NOTICE '🎯 Ready to start development!';
END $$;
