import { nanoid } from 'nanoid';
import { db } from '@/database/db';
import { paymentTransactions } from '@/database/schema';
import type { SepayWebhookPayload } from './types';

interface RecordPaymentInput {
  payload: SepayWebhookPayload;
  rawBody: string;
}

interface RecordPaymentResult {
  recorded: boolean;
}

/**
 * Insert a payment_transactions audit row for a SePay webhook.
 * - `recorded === false` when `skipOnConflict` is true and the same
 *   `sepayTransactionId` already exists (idempotency on duplicate webhook).
 * - Audit rows (`sepayTransactionId === null`) ignore the conflict target.
 */
export async function recordPaymentTransaction(
  input: RecordPaymentInput,
  options: { skipOnConflict?: boolean } = {},
): Promise<RecordPaymentResult> {
  const values = {
    id: nanoid(),
    orderId: null,
    // When payload.id is null (SePay occasionally sends `id: null`),
    // store empty string so the unique index allows the audit row but
    // a second null-id payload will still be treated as a separate event.
    sepayTransactionId: input.payload.id === null ? '' : String(input.payload.id),
    amountVnd: String(input.payload.transferAmount),
    content: input.payload.content,
    rawPayload: input.rawBody,
  };

  if (options.skipOnConflict) {
    const inserted = await db
      .insert(paymentTransactions)
      .values(values)
      .onConflictDoNothing({ target: paymentTransactions.sepayTransactionId })
      .returning({ id: paymentTransactions.id });
    return { recorded: inserted.length > 0 };
  }

  await db.insert(paymentTransactions).values(values);
  return { recorded: true };
}
