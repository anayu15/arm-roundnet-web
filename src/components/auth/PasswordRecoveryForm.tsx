import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Loader2, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { authService } from '@/services/auth.service'

const recoverySchema = z.object({
  email: z.string().email('Email inválido'),
})

type RecoveryFormValues = z.infer<typeof recoverySchema>

export const PasswordRecoveryForm = () => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  const form = useForm<RecoveryFormValues>({
    resolver: zodResolver(recoverySchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (values: RecoveryFormValues) => {
    setIsLoading(true)
    try {
      const { error } = await authService.resetPassword(values.email)

      if (error) {
        toast.error('Error al enviar email', {
          description: error.message || 'Por favor intenta de nuevo',
        })
        return
      }

      setEmailSent(true)
      toast.success('Email enviado', {
        description: 'Revisa tu bandeja de entrada para restablecer tu contraseña',
      })

      form.reset()
    } catch (error) {
      toast.error('Error inesperado', {
        description: 'Por favor intenta de nuevo más tarde',
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (emailSent) {
    return (
      <div className="w-full max-w-md mx-auto text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <svg
              className="w-8 h-8 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-2">Revisa tu email</h1>
          <p className="text-muted-foreground">
            Te hemos enviado un enlace para restablecer tu contraseña. Por favor revisa tu
            bandeja de entrada y sigue las instrucciones.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            ¿No recibiste el email? Revisa tu carpeta de spam o{' '}
            <button
              onClick={() => setEmailSent(false)}
              className="text-primary hover:underline font-medium"
            >
              intenta de nuevo
            </button>
          </p>

          <Link to="/login">
            <Button variant="outline" className="w-full">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al inicio de sesión
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('auth.resetPassword')}</h1>
        <p className="text-muted-foreground">
          Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                <FormDescription>
                  Ingresa el email asociado a tu cuenta
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enviar enlace de recuperación
          </Button>
        </form>
      </Form>

      <div className="mt-6 text-center">
        <Link to="/login" className="text-sm text-muted-foreground hover:text-primary">
          <ArrowLeft className="inline-block mr-1 h-4 w-4" />
          Volver al inicio de sesión
        </Link>
      </div>
    </div>
  )
}
