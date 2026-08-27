import { extractOrderCode } from './payment-content';
import type { SepayTransaction, SepayWebhookPayload } from './types';

/**
 * Map a SePay webhook payload into the domain transaction shape used by
 * the admin list endpoint. Returns null when the payload is not actionable:
 *   - outbound transfer (we only care about incoming)
 *   - no extractable order code in the content (not a SmartKit payment)
 */
export function processSepayTransaction(payload: SepayWebhookPayload): SepayTransaction | null {
  if (payload.transferType !== 'in') {
    return null;
  }

  const orderCode = extractOrderCode(payload.content);
  if (!orderCode) {
    return null;
  }

  return {
    ...payload,
    orderCode,
    processedAt: new Date(),
  };
}
