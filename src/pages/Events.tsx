import { useTranslation } from 'react-i18next'

export default function Events() {
  const { t } = useTranslation()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t('events.title')}</h1>
      <p className="text-muted-foreground">Events list coming soon...</p>
    </div>
  )
}
