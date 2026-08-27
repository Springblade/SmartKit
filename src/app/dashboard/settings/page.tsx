import { requireAuth } from '@/features/auth/lib/auth';

export default async function SettingsPage() {
  const session = await requireAuth();
  const user = session.user as { name?: string | null; email: string; role?: string | null };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-sm text-muted-foreground">Quản lý thông tin tài khoản của bạn</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Thông tin cá nhân</h3>
          <dl className="mt-4 space-y-4">
            <div>
              <dt className="text-sm font-medium">Name</dt>
              <dd className="mt-1 rounded-md border px-3 py-2">{user.name ?? 'Not set'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Email</dt>
              <dd className="mt-1 rounded-md border px-3 py-2">{user.email}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium">Role</dt>
              <dd className="mt-1 rounded-md border px-3 py-2">{user.role === 'admin' ? 'Administrator' : 'User'}</dd>
            </div>
          </dl>
        </div>

        {/* Security Section */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">Bảo mật</h3>
          <p className="mt-1 text-sm text-muted-foreground">Quản lý mật khẩu và bảo mật tài khoản</p>
          <div className="mt-4">
            <a
              href="/auth/reset-password"
              className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              Đổi mật khẩu
            </a>
          </div>
        </div>

        {/* Account Section */}
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
          <h3 className="text-lg font-semibold text-destructive">Vùng nguy hiểm</h3>
          <p className="mt-1 text-sm text-muted-foreground">Các hành động không thể hoàn tác</p>
          <div className="mt-4">
            <button
              type="button"
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
            >
              Xóa tài khoản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
