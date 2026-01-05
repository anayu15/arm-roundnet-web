import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { authService } from '@/services/auth.service'
import { PLAYER_LEVELS, GENDER_OPTIONS } from '@/lib/constants'

const registerSchema = z
  .object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
    confirmPassword: z.string(),
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    apellidos: z.string().min(2, 'Los apellidos deben tener al menos 2 caracteres'),
    telefono: z.string().optional(),
    nivel_juego: z.enum(['principiante', 'intermedio', 'avanzado', 'profesional']),
    genero: z.enum(['masculino', 'femenino', 'otro']),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  })

type RegisterFormValues = z.infer<typeof registerSchema>

export const RegisterForm = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      apellidos: '',
      telefono: '',
      nivel_juego: 'principiante',
      genero: 'masculino',
    },
  })

  const onSubmit = async (values: RegisterFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await authService.signUp({
        email: values.email,
        password: values.password,
        name: values.name,
        apellidos: values.apellidos,
        telefono: values.telefono,
        nivel_juego: values.nivel_juego,
        genero: values.genero,
      })

      if (error) {
        toast.error('Error al crear cuenta', {
          description: error.message || 'Por favor verifica los datos e intenta de nuevo',
        })
        return
      }

      toast.success('¡Cuenta creada!', {
        description: 'Por favor revisa tu email para confirmar tu cuenta',
      })

      // Redirect to login
      navigate('/login')
    } catch (error) {
      toast.error('Error inesperado', {
        description: 'Por favor intenta de nuevo más tarde',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('auth.signUp')}</h1>
        <p className="text-muted-foreground">
          Crea tu cuenta para unirte a la comunidad
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.email')}</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Password */}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.password')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Confirm Password */}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.confirmPassword')}</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.name')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Juan"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Last Name */}
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.lastName')}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="García"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Phone (optional) */}
          <FormField
            control={form.control}
            name="telefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.phone')} (opcional)</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="+34 600 000 000"
                    disabled={isLoading}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Género */}
          <FormField
            control={form.control}
            name="genero"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.gender')}</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu género" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={GENDER_OPTIONS.MASCULINO}>
                      {t('gender.masculino')}
                    </SelectItem>
                    <SelectItem value={GENDER_OPTIONS.FEMENINO}>
                      {t('gender.femenino')}
                    </SelectItem>
                    <SelectItem value={GENDER_OPTIONS.OTRO}>
                      {t('gender.otro')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nivel de juego */}
          <FormField
            control={form.control}
            name="nivel_juego"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t('auth.level')}</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona tu nivel" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={PLAYER_LEVELS.PRINCIPIANTE}>
                      {t('levels.principiante')}
                    </SelectItem>
                    <SelectItem value={PLAYER_LEVELS.INTERMEDIO}>
                      {t('levels.intermedio')}
                    </SelectItem>
                    <SelectItem value={PLAYER_LEVELS.AVANZADO}>
                      {t('levels.avanzado')}
                    </SelectItem>
                    <SelectItem value={PLAYER_LEVELS.PROFESIONAL}>
                      {t('levels.profesional')}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('auth.signUp')}
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center text-sm">
        <span className="text-muted-foreground">{t('auth.hasAccount')} </span>
        <Link to="/login" className="text-primary hover:underline font-medium">
          {t('auth.signIn')}
        </Link>
      </div>
    </div>
  )
}
