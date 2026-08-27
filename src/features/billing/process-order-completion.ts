import 'server-only';
import { and, eq } from 'drizzle-orm';
import { db } from '@/database/db';
import { orders, paymentTransactions } from '@/database/schema';

interface CompletionInput {
  sepayTransactionId: number;
  transferAmount: number;
  orderCode: string;
}

export type CompletionResult =
  | { status: 'completed'; orderId: string; planId: string; userId: string }
  | { status: 'ignored'; reason: 'order_not_found' | 'order_not_pending' | 'amount_mismatch' };

/**
 * Atomically complete an order matching `orderCode` from a SePay webhook.
 * Shared by the webhook handler and the cron polling fallback.
 *
 * Behavior matrix:
 * - `order_not_found`        → no order matches the code; caller should still have
 *                              recorded the payment transaction audit row.
 * - `order_not_pending`      → order exists but is already completed/expired/cancelled.
 * - `amount_mismatch`        → transfer amount differs from order amount.
 * - `completed`              → order was pending, amounts match, now flipped to completed.
 *
 * Note: idempotency on `payment_transactions.sepay_transaction_id` must already
 * have been checked by the caller. This helper assumes the caller has inserted
 * the audit row and decided to proceed with completion.
 */
export async function processOrderCompletion(input: CompletionInput): Promise<CompletionResult> {
  const { sepayTransactionId, transferAmount, orderCode } = input;

  const orderRows = await db.select().from(orders).where(eq(orders.code, orderCode)).limit(1);
  const order = orderRows[0];

  if (!order) {
    return { status: 'ignored', reason: 'order_not_found' };
  }

  if (order.status !== 'pending') {
    await db
      .update(paymentTransactions)
      .set({ orderId: order.id })
      .where(eq(paymentTransactions.sepayTransactionId, String(sepayTransactionId)));
    return { status: 'ignored', reason: 'order_not_pending' };
  }

  if (Number(order.amountVnd) !== transferAmount) {
    return { status: 'ignored', reason: 'amount_mismatch' };
  }

  await db.transaction(async (tx) => {
    await tx
      .update(orders)
      .set({ status: 'completed', completedAt: new Date() })
      .where(and(eq(orders.id, order.id), eq(orders.status, 'pending')));

    await tx
      .update(paymentTransactions)
      .set({ orderId: order.id })
      .where(eq(paymentTransactions.sepayTransactionId, String(sepayTransactionId)));
  });

  return { status: 'completed', orderId: order.id, planId: order.planId, userId: order.userId };
}
