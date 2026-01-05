// App constants
export const APP_NAME = 'Asociación Roundnet Madrid'
export const APP_SHORT_NAME = 'ARM'

// Event types
export const EVENT_TYPES = {
  TORNEO: 'torneo',
  ENTRENAMIENTO: 'entrenamiento',
  SOCIAL: 'social',
} as const

export const EVENT_TYPE_LABELS = {
  torneo: 'Torneo',
  entrenamiento: 'Entrenamiento',
  social: 'Quedada Social',
}

// Event status
export const EVENT_STATUS = {
  UPCOMING: 'upcoming',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const

export const EVENT_STATUS_LABELS = {
  upcoming: 'Próximo',
  ongoing: 'En curso',
  completed: 'Finalizado',
  cancelled: 'Cancelado',
}

// Player levels
export const PLAYER_LEVELS = {
  PRINCIPIANTE: 'principiante',
  INTERMEDIO: 'intermedio',
  AVANZADO: 'avanzado',
  PROFESIONAL: 'profesional',
} as const

export const PLAYER_LEVEL_LABELS = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
  profesional: 'Profesional',
}

// Gender options
export const GENDER_OPTIONS = {
  MASCULINO: 'masculino',
  FEMENINO: 'femenino',
  OTRO: 'otro',
} as const

export const GENDER_LABELS = {
  masculino: 'Masculino',
  femenino: 'Femenino',
  otro: 'Otro',
}

// Team categories
export const TEAM_CATEGORIES = {
  MIXTO: 'mixto',
  MASCULINO: 'masculino',
  FEMENINO: 'femenino',
  OPEN: 'open',
} as const

export const TEAM_CATEGORY_LABELS = {
  mixto: 'Mixto',
  masculino: 'Masculino',
  femenino: 'Femenino',
  open: 'Open',
}

// Payment status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const

export const PAYMENT_STATUS_LABELS = {
  pending: 'Pendiente',
  completed: 'Pagado',
  failed: 'Fallido',
  refunded: 'Reembolsado',
}

// Payment methods
export const PAYMENT_METHODS = {
  STRIPE: 'stripe',
  CASH: 'cash',
  TRANSFER: 'transfer',
} as const

export const PAYMENT_METHOD_LABELS = {
  stripe: 'Tarjeta (Stripe)',
  cash: 'Efectivo',
  transfer: 'Transferencia',
}

// Training info
export const TRAINING_INFO = {
  days: ['Lunes', 'Miércoles'],
  time: '21:00 - 22:30',
  location: 'Polideportivo La Elipa',
  address: 'Calle de O\'Donnell, 28009 Madrid',
  coordinates: {
    lat: 40.4284,
    lng: -3.6404,
  },
}

// Contact
export const CONTACT_EMAIL = 'info@roundnetmadrid.com'

// Social media
export const SOCIAL_LINKS = {
  instagram: 'https://www.instagram.com/roundnet_madrid',
  email: CONTACT_EMAIL,
}

// Current season
export const CURRENT_SEASON = '2026'

// Date formats
export const DATE_FORMATS = {
  short: 'dd/MM/yyyy',
  long: 'dd MMMM yyyy',
  time: 'HH:mm',
  dateTime: 'dd/MM/yyyy HH:mm',
}
