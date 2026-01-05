import { useTranslation } from 'react-i18next'

export default function Login() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('auth.signIn')}</h1>
      <p className="text-muted-foreground">Login form coming soon...</p>
    </div>
  )
}
