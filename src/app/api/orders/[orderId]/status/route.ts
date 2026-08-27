import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/database/db';
import { orders } from '@/database/schema';
import { requireAuth } from '@/features/auth';

export async function GET(_req: Request, { params }: { params: Promise<{ orderId: string }> }) {
  const session = await requireAuth();
  const { orderId } = await params;

  const result = await db
    .select({ id: orders.id, status: orders.status, expiresAt: orders.expiresAt, completedAt: orders.completedAt })
    .from(orders)
    .where(and(eq(orders.id, orderId), eq(orders.userId, session.user.id)))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  return NextResponse.json({
    status: result[0].status,
    expiresAt: result[0].expiresAt.toISOString(),
    completedAt: result[0].completedAt?.toISOString() ?? null,
  });
}
