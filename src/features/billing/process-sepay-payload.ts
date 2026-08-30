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
 * The webhook route validates signatures first, then delegates here with the
 * original parsed payload and raw body for accurate audit rows.
 */
import 'server-only';
import { extractOrderCode } from './payment-content';
import { recordPaymentTransaction } from './payment-transactions';
import { type CompletionResult, processOrderCompletion } from './process-order-completion';
import type { SepayWebhookPayload } from './types';

export type ProcessSepayPayloadResult =
  | CompletionResult
  | { status: 'already_processed' }
  | {
      status: 'ignored';
      reason: 'no_transaction_id' | 'outbound' | 'no_order_code';
    };

interface ProcessSepayPayloadInput {
  id: number | null;
  transferType: 'in' | 'out';
  transferAmount: number;
  content: string;
}

interface ProcessSepayPayloadOptions {
  /** Full parsed webhook payload for audit rows. Cron omits this. */
  auditPayload?: SepayWebhookPayload;
  /** Original request body for audit rows. Defaults to JSON.stringify(input). */
  rawBody?: string;
}

export async function processSepayPayload(
  input: ProcessSepayPayloadInput,
  options?: ProcessSepayPayloadOptions,
): Promise<ProcessSepayPayloadResult> {
  const { id, transferType, transferAmount, content } = input;

  const auditPayload: SepayWebhookPayload = options?.auditPayload ?? {
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
  const rawBody = options?.rawBody ?? JSON.stringify(input);

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

  return processOrderCompletion({
    sepayTransactionId: id,
    transferAmount,
    orderCode,
  });
}
