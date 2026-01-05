import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Menu, X, User, LogOut, UserCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { ThemeToggle } from '@/components/shared/ThemeToggle'
import { LanguageSelector } from '@/components/shared/LanguageSelector'
import { useAuth } from '@/hooks/useAuth'

export const Header = () => {
  const { t } = useTranslation()
  const { isAuthenticated, profile, logout, isAdmin } = useAuth()
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { to: '/', label: t('nav.home') },
    { to: '/events', label: t('nav.events') },
    { to: '/ranking', label: t('nav.ranking'), disabled: true },
    { to: '/trainings', label: t('nav.trainings'), disabled: true },
  ]

  const handleLogout = async () => {
    try {
      await logout()
      navigate('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const UserMenu = () => {
    if (!isAuthenticated || !profile) {
      return (
        <div className="flex gap-2">
          <Link to="/login">
            <Button variant="ghost">{t('common.login')}</Button>
          </Link>
          <Link to="/register">
            <Button>{t('common.register')}</Button>
          </Link>
        </div>
      )
    }

    const initials = `${profile.name[0]}${profile.apellidos[0]}`.toUpperCase()

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar>
              <AvatarImage src={profile.foto_perfil_url || undefined} alt={profile.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <div className="flex items-center gap-2 p-2">
            <Avatar>
              <AvatarImage src={profile.foto_perfil_url || undefined} alt={profile.name} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium">
                {profile.name} {profile.apellidos}
              </p>
              <p className="text-xs text-muted-foreground">{profile.email}</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/profile')}>
            <UserCircle className="mr-2 h-4 w-4" />
            {t('nav.profile')}
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem onClick={() => navigate('/admin')}>
              <User className="mr-2 h-4 w-4" />
              {t('nav.admin')}
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            {t('common.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="text-2xl font-bold bg-gradient-to-r from-arm-blue-500 to-arm-orange-500 bg-clip-text text-transparent">
              ARM
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  link.disabled ? 'opacity-50 pointer-events-none' : ''
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <LanguageSelector />
            <UserMenu />
          </div>

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col gap-4 mt-8">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`text-lg font-medium py-2 transition-colors hover:text-primary ${
                          link.disabled ? 'opacity-50 pointer-events-none' : ''
                        }`}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>

                  {/* Mobile Actions */}
                  <div className="pt-4 border-t">
                    <LanguageSelector />
                  </div>

                  {/* Mobile User Menu */}
                  <div className="pt-4 border-t">
                    {!isAuthenticated ? (
                      <div className="flex flex-col gap-2">
                        <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full">
                            {t('common.login')}
                          </Button>
                        </Link>
                        <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full">{t('common.register')}</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <Link to="/profile" onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="outline" className="w-full justify-start">
                            <UserCircle className="mr-2 h-4 w-4" />
                            {t('nav.profile')}
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link to="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full justify-start">
                              <User className="mr-2 h-4 w-4" />
                              {t('nav.admin')}
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => {
                            handleLogout()
                            setMobileMenuOpen(false)
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          {t('common.logout')}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
