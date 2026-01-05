import { loadStripe } from '@stripe/stripe-js'

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

// Note: Stripe key might not be configured yet, so we handle it gracefully
export const stripePromise = stripePublishableKey
  ? loadStripe(stripePublishableKey)
  : null

export const isStripeConfigured = !!stripePublishableKey
