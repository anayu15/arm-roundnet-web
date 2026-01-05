import { useTranslation } from 'react-i18next'
import { Instagram, Mail } from 'lucide-react'
import { SOCIAL_LINKS, CONTACT_EMAIL } from '@/lib/constants'

export const Footer = () => {
  const { t } = useTranslation()
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-lg font-semibold mb-4">ARM</h3>
            <p className="text-sm text-muted-foreground">
              Asociación Roundnet Madrid
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.contact')}</h3>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-primary transition-colors">
                {CONTACT_EMAIL}
              </a>
            </div>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-semibold mb-4">{t('footer.followUs')}</h3>
            <div className="flex gap-4">
              <a
                href={SOCIAL_LINKS.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            © {currentYear} ARM - Asociación Roundnet Madrid. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  )
}
