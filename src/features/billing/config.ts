// Billing feature configuration constants
// Centralized for easy tuning and to avoid magic numbers scattered across files

/** How often the frontend polls for order status updates (milliseconds) */
export const POLL_INTERVAL_MS = 5000;

/** How long a pending order stays valid before auto-expiry (minutes) */
export const ORDER_TTL_MINUTES = 15;

/** How far back the cron job looks for SePay transactions (minutes) */
export const POLLING_LOOKBACK_MINUTES = 10;
