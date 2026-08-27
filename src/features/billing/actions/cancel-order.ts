'use server';

import { and, eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { db } from '@/database/db';
import { orders } from '@/database/schema';
import { getSession } from '@/features/auth/lib/auth';
import { BillingError } from '../errors';

/**
 * Cancel a pending order. Only the order owner can cancel, and only
 * while `status='pending'`. Enforced via composite WHERE in SQL.
 */
export async function cancelOrder(orderId: string) {
  const session = await getSession();
  if (!session) throw new BillingError('UNAUTHORIZED');

  const result = await db
    .update(orders)
    .set({ status: 'cancelled' })
    .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id), eq(orders.status, 'pending')))
    .returning({ id: orders.id });

  if (!result[0]) {
    throw new BillingError('ORDER_NOT_FOUND_OR_NOT_PENDING');
  }

  revalidatePath('/dashboard/billing');
  revalidatePath('/dashboard/billing/history');
  return { orderId: result[0].id };
}
