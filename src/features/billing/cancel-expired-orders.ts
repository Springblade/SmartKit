import 'server-only';
import { and, eq, lt } from 'drizzle-orm';
import { db } from '@/database/db';
import { orders } from '@/database/schema';

/**
 * Mark all pending orders whose `expires_at` has passed as `expired`.
 * Runs idempotently — only touches rows where status='pending'.
 *
 * Backed by `orders_status_expires_idx` (status, expires_at).
 */
export async function cancelExpiredOrders(): Promise<{ cancelled: number }> {
  const result = await db
    .update(orders)
    .set({ status: 'expired' })
    .where(and(eq(orders.status, 'pending'), lt(orders.expiresAt, new Date())))
    .returning({ id: orders.id });

  return { cancelled: result.length };
}
