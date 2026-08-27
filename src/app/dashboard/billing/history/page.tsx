import { ArrowLeft, ReceiptText } from 'lucide-react';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/database/db';
import { orders } from '@/database/schema';
import { requireAuth } from '@/features/auth/lib/auth';

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
        <h2 className="text-2xl font-bold tracking-tight">Lịch sử thanh toán</h2>
        <p className="text-zinc-500 dark:text-zinc-400">Xem lại các giao dịch và hóa đơn của bạn</p>
      </div>

      {userOrders.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border bg-card p-12 text-center">
          <ReceiptText className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-medium">Chưa có giao dịch nào</h3>
          <p className="mt-1 text-sm text-muted-foreground">Các giao dịch của bạn sẽ xuất hiện ở đây sau khi bạn mua gói dịch vụ</p>
          <Link
            href="/dashboard/billing"
            className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Chọn gói dịch vụ
          </Link>
        </div>
      ) : (
        <div className="rounded-lg border">
          <table className="w-full">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium">Mã giao dịch</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Gói</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Số tiền</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Ngày</th>
                <th className="px-4 py-3 text-left text-sm font-medium">Trạng thái</th>
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
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        order.status === 'completed'
                          ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                          : order.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                      }`}
                    >
                      {order.status === 'completed'
                        ? 'Hoàn thành'
                        : order.status === 'pending'
                          ? 'Đang chờ'
                          : order.status === 'expired'
                            ? 'Hết hạn'
                            : 'Đã hủy'}
                    </span>
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
          Quay lại
        </Link>
      </div>
    </div>
  );
}
