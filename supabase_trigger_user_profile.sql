-- Función que crea automáticamente el perfil del usuario
-- Se ejecuta cuando se crea un usuario en auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, name, apellidos, nivel_juego, genero, telefono, rol)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'apellidos', ''),
    COALESCE(NEW.raw_user_meta_data->>'nivel_juego', 'principiante'),
    COALESCE(NEW.raw_user_meta_data->>'genero', 'otro'),
    NEW.raw_user_meta_data->>'telefono',
    'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que ejecuta la función cuando se crea un usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Actualizar la política de INSERT para permitir que el trigger funcione
DROP POLICY IF EXISTS "Users can insert own profile" ON public.users;
CREATE POLICY "Allow trigger to insert user profile" ON public.users
  FOR INSERT WITH CHECK (true);

-- Mantener las otras políticas como están
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);
