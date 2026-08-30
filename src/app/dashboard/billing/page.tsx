import { eq } from 'drizzle-orm';
import Link from 'next/link';
import { Suspense } from 'react';
import { db } from '@/database/db';
import { orders, plans } from '@/database/schema';
import { requireAuth } from '@/features/auth/lib/auth';
import { createOrder } from '@/features/billing/actions/create-order';
import { OrderStatusBadge } from '@/features/billing/components/OrderStatusBadge';
import { PaymentSection } from '@/features/billing/components/PaymentSection';
import { PlanCard } from '@/features/billing/components/PlanCard';
import { BillingError } from '@/features/billing/errors';

const STRINGS = {
  pageTitle: 'Billing',
  pageSubtitle: 'Manage your subscription and payments',
  currentPlanTitle: 'Current Plan',
  transactionHistoryLink: 'Transaction history',
  backLink: '← Back',
  errors: {
    planNotFound: 'Plan not found',
    alreadyOwned: 'You already have this plan',
    genericFallback: 'Unable to create the order right now. Please try again later.',
  },
} as const;

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(date);
}

export default async function BillingPage({ searchParams }: { searchParams: Promise<{ plan?: string }> }) {
  const session = await requireAuth();
  const userId = session.user.id;
  const params = await searchParams;
  const selectedPlanId = params.plan;

  // Get user's current active plan (most recent completed order)
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: { plan: true },
    orderBy: (orders, { desc }) => [desc(orders.createdAt)],
    limit: 1,
  });

  const currentOrder = userOrders[0];

  // Get all available plans
  const allPlans = await db.query.plans.findMany({
    where: eq(plans.isActive, true),
    orderBy: (plans, { asc }) => [asc(plans.priceVnd)],
  });

  // Handle plan selection: create order or get existing pending order
  let pendingOrder = null;
  let selectedPlan = null;
  let orderError = null;

  if (selectedPlanId) {
    try {
      // Find the selected plan
      selectedPlan = allPlans.find((p) => p.id === selectedPlanId);
      if (!selectedPlan) {
        orderError = STRINGS.errors.planNotFound;
      } else if (currentOrder?.planId === selectedPlanId && currentOrder?.status === 'completed') {
        orderError = STRINGS.errors.alreadyOwned;
      } else {
        // Create order (will throw if pending order already exists)
        const result = await createOrder(selectedPlanId);
        // Fetch the created order to get expiresAt
        const createdOrder = await db.query.orders.findFirst({
          where: eq(orders.id, result.orderId),
        });
        if (!createdOrder) {
          throw new BillingError('ORDER_FAILED');
        }

        pendingOrder = {
          orderId: result.orderId,
          code: result.code,
          content: result.content,
          amountVnd: result.amountVnd,
          expiresAt: createdOrder.expiresAt,
        };
      }
    } catch (error) {
      // Note: ORDER_PENDING_EXISTS should not occur anymore since createOrder
      // auto-cancels all pending orders before creating a new one.
      if (error instanceof BillingError) {
        orderError = error.userMessage;
      } else {
        orderError = STRINGS.errors.genericFallback;
      }
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{STRINGS.pageTitle}</h2>
        <p className="text-muted-foreground">{STRINGS.pageSubtitle}</p>
      </div>

      {/* Error Message */}
      {orderError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
          <p className="text-sm text-red-600 dark:text-red-400">{orderError}</p>
          <Link
            href="/dashboard/billing"
            className="mt-2 inline-block text-sm font-medium text-red-600 hover:underline dark:text-red-400"
          >
            {STRINGS.backLink}
          </Link>
        </div>
      )}

      {/* Payment Section */}
      {pendingOrder && selectedPlan && (
        <Suspense fallback={<PaymentSectionSkeleton />}>
          <PaymentSection
            order={{
              id: pendingOrder.orderId,
              code: pendingOrder.code,
              content: pendingOrder.content,
              amountVnd: pendingOrder.amountVnd,
              expiresAt: pendingOrder.expiresAt.toISOString(),
            }}
            plan={{
              id: selectedPlan.id,
              name: selectedPlan.name,
              priceVnd: Number(selectedPlan.priceVnd),
            }}
          />
        </Suspense>
      )}

      {/* Current Plan */}
      {currentOrder && !pendingOrder && (
        <div className="rounded-xl border bg-card p-6">
          <h3 className="text-lg font-semibold">{STRINGS.currentPlanTitle}</h3>
          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <p className="text-xl font-bold">{currentOrder.plan.name}</p>
                <OrderStatusBadge status={currentOrder.status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {Number(currentOrder.plan.priceVnd).toLocaleString('vi-VN')} VND
                {currentOrder.completedAt && (
                  <span className="ml-2">· Purchased on {formatDate(new Date(currentOrder.completedAt))}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Plans Section */}
      {!pendingOrder && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-semibold">Choose Your Plan</h3>
            <p className="text-sm text-muted-foreground">Select the plan that best fits your needs</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {allPlans.map((plan, index) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                isCurrentPlan={currentOrder?.planId === plan.id && currentOrder?.status === 'completed'}
                isPopular={index === 1}
              />
            ))}
          </div>
        </div>
      )}

      {/* Quick Links */}
      <div className="flex gap-4 border-t pt-6">
        <Link
          href="/dashboard/billing/history"
          className="rounded-lg border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          {STRINGS.transactionHistoryLink}
        </Link>
      </div>
    </div>
  );
}

function PaymentSectionSkeleton() {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="h-6 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-4 flex gap-6">
        <div className="h-48 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="flex flex-1 flex-col gap-4">
          <div className="h-20 animate-pulse rounded-lg bg-muted" />
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
          <div className="h-16 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    </div>
  );
}
