import { OrderCodePrefix } from './types';

/**
 * Pure helpers for parsing / generating SePay payment content.
 * No DB, no I/O — safe to import from client bundles.
 */

/**
 * Extract order code from SePay transaction content.
 * Format: "SK aBc12345" -> "aBc12345"
 */
export function extractOrderCode(content: string): string | null {
  const trimmed = content.trim();

  if (!trimmed.startsWith(OrderCodePrefix)) {
    return null;
  }

  const code = trimmed.slice(OrderCodePrefix.length).trim();

  if (!code || code.length < 5 || code.length > 50) {
    return null;
  }

  return code;
}

/**
 * Generate the unique description for a payment, embedded in QR content.
 */
export function generatePaymentContent(orderCode: string): string {
  return `${OrderCodePrefix} ${orderCode}`;
}
