import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Calendar, Trophy, Users, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const { t } = useTranslation()

  const features = [
    {
      icon: <Calendar className="h-10 w-10 text-arm-blue-500" />,
      title: 'Eventos y Torneos',
      description: 'Participa en torneos competitivos y eventos sociales durante todo el año',
    },
    {
      icon: <Trophy className="h-10 w-10 text-arm-orange-500" />,
      title: 'Sistema de Ranking',
      description: 'Sigue tu progreso y compite por los primeros puestos en el ranking oficial',
    },
    {
      icon: <Users className="h-10 w-10 text-arm-blue-500" />,
      title: 'Comunidad Activa',
      description: 'Únete a una comunidad apasionada y conoce nuevos compañeros de juego',
    },
    {
      icon: <MapPin className="h-10 w-10 text-arm-orange-500" />,
      title: 'Entrenamientos Semanales',
      description: 'Entrena con nosotros todos los lunes y miércoles en La Elipa',
    },
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-arm-blue-500 to-arm-orange-500 text-white">
        <div className="container mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Asociación Roundnet Madrid
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90 animate-in fade-in slide-in-from-bottom-5 duration-1000 delay-100">
              La comunidad de roundnet más grande de Madrid
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-200">
              <Link to="/events">
                <Button size="lg" variant="secondary" className="text-lg px-8">
                  {t('nav.events')}
                </Button>
              </Link>
              <Link to="/register">
                <Button size="lg" variant="outline" className="text-lg px-8 bg-white/10 hover:bg-white/20 border-white text-white">
                  {t('common.register')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        {/* Wave separator */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full">
            <path
              fill="hsl(var(--background))"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            ¿Por qué unirte a ARM?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-2 hover:border-primary transition-colors">
                <CardHeader>
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a nuestra comunidad y descubre el deporte de más rápido crecimiento en España
          </p>
          <Link to="/register">
            <Button size="lg" className="text-lg px-8">
              Crear cuenta
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
