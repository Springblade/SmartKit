/**
 * Domain-level error codes for billing actions. Callers (server actions,
 * client components) switch on `code` to display localized messages.
 *
 * Throw via `throw new BillingError('CODE', 'human readable english message')`.
 * Client components should import `BillingError` and branch on `code`,
 * not on `message` (which may change for translation / wording).
 */
export type BillingErrorCode =
  | 'UNAUTHORIZED'
  | 'PLAN_NOT_FOUND'
  | 'PLAN_INACTIVE'
  | 'ALREADY_PURCHASED'
  | 'ORDER_PENDING_EXISTS'
  | 'ORDER_NOT_FOUND_OR_NOT_PENDING'
  | 'SEPAY_NOT_CONFIGURED'
  | 'ORDER_NOT_FOUND'
  | 'ORDER_NOT_PENDING'
  | 'ORDER_FAILED'
  | 'SIMULATION_FAILED';

const ENGLISH_MESSAGES: Record<BillingErrorCode, string> = {
  UNAUTHORIZED: 'You need to sign in to continue.',
  PLAN_NOT_FOUND: 'This plan could not be found.',
  PLAN_INACTIVE: 'This plan is currently unavailable.',
  ALREADY_PURCHASED: 'You already own this plan.',
  ORDER_PENDING_EXISTS:
    'You already have a pending order for this plan. Please complete or cancel it before creating a new one.',
  ORDER_NOT_FOUND_OR_NOT_PENDING: 'Order not found or not in pending status.',
  SEPAY_NOT_CONFIGURED: 'SePay is not configured. Please contact the administrator.',
  ORDER_NOT_FOUND: 'Order not found.',
  ORDER_NOT_PENDING: 'Order is not in pending payment status.',
  ORDER_FAILED: 'Could not create the order.',
  SIMULATION_FAILED: 'Payment simulation failed.',
};

export class BillingError extends Error {
  readonly code: BillingErrorCode;

  constructor(code: BillingErrorCode, message?: string) {
    super(message ?? ENGLISH_MESSAGES[code]);
    this.name = 'BillingError';
    this.code = code;
  }

  /** Localized English message suitable for end users. */
  get userMessage(): string {
    return ENGLISH_MESSAGES[this.code];
  }
}
