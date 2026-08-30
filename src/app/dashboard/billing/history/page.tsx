import { desc, eq } from 'drizzle-orm';
import { ArrowLeft, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/database/db';
import { orders } from '@/database/schema';
import { requireAuth } from '@/features/auth/lib/auth';
import { OrderStatusBadge } from '@/features/billing/components/OrderStatusBadge';

const STRINGS = {
  pageTitle: 'Payment History',
  pageSubtitle: 'Review your transactions and invoices',
  emptyTitle: 'No transactions yet',
  emptyBody: 'Your transactions will appear here after you purchase a subscription',
  selectPlan: 'Select a plan',
  tableHeaders: {
    transactionCode: 'Transaction ID',
    plan: 'Plan',
    amount: 'Amount',
    date: 'Date',
    status: 'Status',
  },
  backLink: 'Back',
} as const;

export default async function BillingHistoryPage() {
  const session = await requireAuth();
  const userId = session.user.id;

  // Get all user orders
  const userOrders = await db.query.orders.findMany({
    where: eq(orders.userId, userId),
    with: { plan: true },
    orderBy: [desc(orders.createdAt)],
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{STRINGS.pageTitle}</h2>
        <p className="text-zinc-500 dark:text-zinc-400">{STRINGS.pageSubtitle}</p>
      </div>

      {userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
          <ReceiptText className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">{STRINGS.emptyTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{STRINGS.emptyBody}</p>
          <Link
            href="/dashboard/billing"
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            {STRINGS.selectPlan}
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">{STRINGS.tableHeaders.transactionCode}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{STRINGS.tableHeaders.plan}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{STRINGS.tableHeaders.amount}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{STRINGS.tableHeaders.date}</th>
                <th className="px-4 py-3 text-left text-sm font-medium">{STRINGS.tableHeaders.status}</th>
              </tr>
            </thead>
            <tbody>
              {userOrders.map((order) => (
                <tr key={order.id} className="border-b last:border-0">
                  <td className="px-4 py-3 text-sm font-mono">{order.code}</td>
                  <td className="px-4 py-3 text-sm">{order.plan.name}</td>
                  <td className="px-4 py-3 text-sm">{Number(order.amountVnd).toLocaleString('vi-VN')} VND</td>
                  <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                  <td className="px-4 py-3 text-sm">
                    <OrderStatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-6">
        <Link
          href="/dashboard/billing"
          className="inline-flex items-center gap-2 rounded-lg border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {STRINGS.backLink}
        </Link>
      </div>
    </div>
  );
}
