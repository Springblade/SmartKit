/**
 * Shared SePay payload processor for both webhook and cron entry points.
 *
 * Both code paths perform the same sequence:
 *   1. Bail out (and audit) when the payload is not actionable (no id, outbound,
 *      no order code extractable).
 *   2. Insert an audit row (`payment_transactions`) with `skipOnConflict: true`
 *      so the loser of a webhook/cron race returns `already_processed`.
 *   3. Hand off to `processOrderCompletion` for the actual order flip.
 *
 * The webhook route does NOT use this helper because it has additional
 * signature-rejection audit codes (`REJECTED_BAD_SIGNATURE`,
 * `REJECTED_EXPIRED_TIMESTAMP`) that must survive even when the payload
 * itself is unparseable. The cron route has no signature caveat, so this
 * helper covers its full surface.
 */
import 'server-only';
import { extractOrderCode } from './payment-content';
import { recordPaymentTransaction } from './payment-transactions';
import { processOrderCompletion } from './process-order-completion';
import type { SepayWebhookPayload } from './types';

export type ProcessSepayPayloadResult =
  | { status: 'completed' }
  | { status: 'already_processed' }
  | {
      status: 'ignored';
      reason:
        | 'no_transaction_id'
        | 'outbound'
        | 'no_order_code'
        | 'order_not_found'
        | 'order_not_pending'
        | 'amount_mismatch';
    };

interface ProcessSepayPayloadInput {
  id: number | null;
  transferType: 'in' | 'out';
  transferAmount: number;
  content: string;
}

export async function processSepayPayload(input: ProcessSepayPayloadInput): Promise<ProcessSepayPayloadResult> {
  const { id, transferType, transferAmount, content } = input;

  // Cron polls fetch `SepayWebhookPayload`-shaped rows but only id/amount/content/
  // transferType are needed. Build a minimal payload for the audit row.
  const auditPayload: SepayWebhookPayload = {
    id,
    gateway: '',
    transactionDate: '',
    accountNumber: '',
    content,
    transferType,
    transferAmount,
    reference: '',
    description: '',
  };
  const rawBody = JSON.stringify(input);

  if (id === null) {
    await recordPaymentTransaction({ payload: auditPayload, rawBody });
    return { status: 'ignored', reason: 'no_transaction_id' };
  }

  if (transferType !== 'in') {
    await recordPaymentTransaction({ payload: auditPayload, rawBody });
    return { status: 'ignored', reason: 'outbound' };
  }

  const orderCode = extractOrderCode(content);
  if (!orderCode) {
    await recordPaymentTransaction({ payload: auditPayload, rawBody });
    return { status: 'ignored', reason: 'no_order_code' };
  }

  const { recorded } = await recordPaymentTransaction({ payload: auditPayload, rawBody }, { skipOnConflict: true });
  if (!recorded) {
    return { status: 'already_processed' };
  }

  const result = await processOrderCompletion({
    sepayTransactionId: id,
    transferAmount,
    orderCode,
  });

  if (result.status === 'completed') {
    return { status: 'completed' };
  }
  return { status: 'ignored', reason: result.reason };
}
