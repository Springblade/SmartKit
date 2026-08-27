'use server';

import { and, eq } from 'drizzle-orm';
import { db } from '@/database/db';
import { orders, plans } from '@/database/schema';
import { getSession } from '@/features/auth/lib/auth';
import { hasUserPurchasedPlan } from '../entitlements';
import { BillingError } from '../errors';
import { getDatabaseErrorCode, getDatabaseErrorConstraint, isPendingOrderConflict } from '../order-errors';
import { generatePaymentContent } from '../payment-content';

const ORDER_TTL_MINUTES = 15;

export async function createOrder(planId: string) {
  const session = await getSession();
  if (!session) throw new BillingError('UNAUTHORIZED');

  const plan = await db
    .select()
    .from(plans)
    .where(and(eq(plans.id, planId), eq(plans.isActive, true)))
    .limit(1);

  if (!plan[0]) throw new BillingError('PLAN_NOT_FOUND');

  if (await hasUserPurchasedPlan(session.user.id, planId)) {
    throw new BillingError('ALREADY_PURCHASED');
  }

  // Auto-cancel all pending orders for this user before creating a new one.
  // This allows users to switch between plans without being blocked by
  // abandoned pending orders (e.g., user navigated away without clicking "Cancel").
  await db
    .update(orders)
    .set({ status: 'cancelled' })
    .where(and(eq(orders.userId, session.user.id), eq(orders.status, 'pending')));

  const expiresAt = new Date(Date.now() + ORDER_TTL_MINUTES * 60 * 1000);

  try {
    const [created] = await db
      .insert(orders)
      .values({
        userId: session.user.id,
        planId: plan[0].id,
        amountVnd: plan[0].priceVnd,
        status: 'pending',
        expiresAt,
      })
      .returning({ id: orders.id, code: orders.code });

    if (!created) {
      throw new BillingError('PLAN_INACTIVE');
    }

    return {
      orderId: created.id,
      code: created.code,
      content: generatePaymentContent(created.code),
      amountVnd: Number(plan[0].priceVnd),
    };
  } catch (error) {
    if (error instanceof BillingError) {
      throw error;
    }

    // Note: isPendingOrderConflict should never happen now since we
    // auto-cancel all pending orders above. Kept for defensive coding.
    if (isPendingOrderConflict(error)) {
      throw new BillingError('ORDER_PENDING_EXISTS');
    }

    console.error('[billing] createOrder failed', {
      errorCode: getDatabaseErrorCode(error),
      constraint: getDatabaseErrorConstraint(error),
      planId,
    });
    throw new BillingError('ORDER_FAILED');
  }
}
