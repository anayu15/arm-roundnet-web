import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1 className="text-9xl font-bold text-primary mb-4">404</h1>
      <h2 className="text-3xl font-semibold mb-4">Página no encontrada</h2>
      <p className="text-muted-foreground mb-8 text-center max-w-md">
        Lo sentimos, la página que buscas no existe o ha sido movida.
      </p>
      <Link to="/">
        <Button size="lg">
          {t('common.back')} al inicio
        </Button>
      </Link>
    </div>
  )
}
