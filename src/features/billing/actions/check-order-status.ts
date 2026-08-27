'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/database/db';
import { orders } from '@/database/schema';
import { getSession } from '@/features/auth/lib/auth';
import { BillingError } from '../errors';

export async function checkOrderStatus(orderId: string) {
  const session = await getSession();
  if (!session) throw new BillingError('UNAUTHORIZED');

  const order = await db.query.orders.findFirst({
    where: eq(orders.id, orderId),
    with: { plan: true },
  });

  if (!order) {
    throw new BillingError('ORDER_NOT_FOUND');
  }

  if (order.userId !== session.user.id) {
    throw new BillingError('UNAUTHORIZED');
  }

  return {
    id: order.id,
    status: order.status,
    plan: order.plan
      ? {
          id: order.plan.id,
          name: order.plan.name,
          priceVnd: Number(order.plan.priceVnd),
        }
      : null,
    expiresAt: order.expiresAt.toISOString(),
    completedAt: order.completedAt?.toISOString() ?? null,
  };
}
