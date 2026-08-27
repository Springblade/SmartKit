import { requireAuth } from '@/features/auth/lib/auth';

export default async function DashboardPage() {
  const session = await requireAuth();
  const user = session.user as { name?: string | null; role?: string | null };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Xin chào, {user.name ?? 'User'}!</h2>
        <p className="text-muted-foreground">Chào mừng bạn quay trở lại SmartKit</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Tài khoản" description="Quản lý thông tin cá nhân và bảo mật" href="/dashboard/settings" />
        <Card title="Thanh toán" description="Xem và quản lý gói dịch vụ của bạn" href="/dashboard/billing" />
        {user.role === 'admin' && (
          <Card title="Người dùng" description="Quản lý tài khoản người dùng" href="/dashboard/admin/users" />
        )}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">Quick Actions</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/dashboard/settings"
            className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Cập nhật profile
          </a>
          <a
            href="/dashboard/billing"
            className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            Xem gói dịch vụ
          </a>
        </div>
      </div>
    </div>
  );
}

function Card({ title, description, href }: { title: string; description: string; href: string }) {
  return (
    <a href={href} className="block rounded-lg border bg-card p-6 transition-colors hover:bg-accent">
      <h3 className="font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </a>
  );
}
