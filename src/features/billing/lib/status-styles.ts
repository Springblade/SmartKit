/**
 * Visual styling tokens for payment flow states.
 *
 * PaymentSection renders several near-identical alert surfaces (success,
 * cancelled, expired, polling error, cancel error). The Tailwind class
 * combinations were originally inlined in PaymentSection.tsx, which made it
 * easy for the same tone to drift between call sites.
 *
 * This module centralizes the class strings so all surfaces with the same
 * semantic tone stay in lock-step. Add a new tone here, not at the call site.
 */

export type PaymentTone = 'success' | 'error' | 'warning' | 'neutral';

interface ToneClasses {
  container: string;
  icon: string;
  title: string;
  body: string;
}

const TONE_CLASSES: Record<PaymentTone, ToneClasses> = {
  success: {
    container: 'rounded-xl border border-green-500/50 bg-green-50/50 dark:bg-green-950/20',
    icon: 'text-green-600 dark:text-green-400',
    title: 'text-green-700 dark:text-green-200',
    body: 'text-muted-foreground',
  },
  error: {
    container: 'rounded-xl border border-red-200 bg-red-50/50 dark:border-red-900 dark:bg-red-950/20',
    icon: 'text-red-600 dark:text-red-400',
    title: 'text-red-700 dark:text-red-200',
    body: 'text-muted-foreground',
  },
  warning: {
    container: 'rounded-lg border border-amber-200 bg-amber-50 dark:border-amber-900 dark:bg-amber-950/30',
    icon: 'text-amber-800 dark:text-amber-200',
    title: 'text-amber-800 dark:text-amber-200',
    body: 'text-amber-800 dark:text-amber-200',
  },
  neutral: {
    container: 'rounded-lg border bg-card',
    icon: 'text-muted-foreground',
    title: 'text-foreground',
    body: 'text-muted-foreground',
  },
};

export function getPaymentToneClasses(tone: PaymentTone): ToneClasses {
  return TONE_CLASSES[tone];
}
