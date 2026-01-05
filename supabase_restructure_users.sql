-- Modificar la tabla users para ajustar los campos
-- 1. Agregar columna nombre_completo
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS nombre_completo TEXT;

-- 2. Migrar datos existentes (si los hay): combinar name + apellidos
UPDATE public.users
SET nombre_completo = CONCAT(name, ' ', apellidos)
WHERE nombre_completo IS NULL AND (name IS NOT NULL OR apellidos IS NOT NULL);

-- 3. Eliminar columnas antiguas
ALTER TABLE public.users DROP COLUMN IF EXISTS name;
ALTER TABLE public.users DROP COLUMN IF EXISTS apellidos;
ALTER TABLE public.users DROP COLUMN IF EXISTS nivel_juego;

-- 4. Hacer nombre_completo NOT NULL
ALTER TABLE public.users ALTER COLUMN nombre_completo SET NOT NULL;

-- 5. Actualizar el trigger para usar el nuevo esquema
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, nombre_completo, genero, telefono, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', ''),
    COALESCE(NEW.raw_user_meta_data->>'genero', 'otro'),
    NEW.raw_user_meta_data->>'telefono',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. Recrear el trigger (en caso de que ya existiera)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. Actualizar política de INSERT
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
DROP POLICY IF EXISTS "Allow trigger to insert user profile" ON public.users;
CREATE POLICY "Allow trigger to insert user profile" ON public.users
  FOR INSERT WITH CHECK (true);

-- 8. Mantener política de SELECT
DROP POLICY IF EXISTS "Users can view all profiles" ON public.users;
CREATE POLICY "Users can view all profiles" ON public.users
  FOR SELECT USING (true);

-- 9. Mantener política de UPDATE
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
