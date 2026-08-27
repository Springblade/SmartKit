import 'server-only';
import { and, eq } from 'drizzle-orm';
import { db } from '@/database/db';
import { orders } from '@/database/schema';

export async function getUserEntitlements(userId: string) {
  return db
    .select({ planId: orders.planId, completedAt: orders.completedAt })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.status, 'completed')));
}

export async function hasUserPurchasedPlan(userId: string, planId: string): Promise<boolean> {
  const result = await db
    .select({ id: orders.id })
    .from(orders)
    .where(and(eq(orders.userId, userId), eq(orders.planId, planId), eq(orders.status, 'completed')))
    .limit(1);
  return result.length > 0;
}
