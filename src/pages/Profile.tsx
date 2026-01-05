import { useTranslation } from 'react-i18next'
import { useAuth } from '@/hooks/useAuth'

export default function Profile() {
  const { t } = useTranslation()
  const { profile } = useAuth()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('profile.title')}</h1>
      {profile && (
        <div className="space-y-2">
          <p><strong>Nombre:</strong> {profile.nombre_completo}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Género:</strong> {profile.genero}</p>
          {profile.telefono && <p><strong>Teléfono:</strong> {profile.telefono}</p>}
        </div>
      )}
    </div>
  )
}
