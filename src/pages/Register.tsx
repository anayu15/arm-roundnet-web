import { useTranslation } from 'react-i18next'

export default function Register() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('auth.signUp')}</h1>
      <p className="text-muted-foreground">Register form coming soon...</p>
    </div>
  )
}
