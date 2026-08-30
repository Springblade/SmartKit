import { requireAuth } from '@/features/auth/lib/auth';

const STRINGS = {
  pageTitle: 'Settings',
  pageSubtitle: 'Manage your account settings',
  profileTitle: 'Profile',
  securityTitle: 'Security',
  securitySubtitle: 'Manage your password and account security',
  changePassword: 'Change password',
  dangerTitle: 'Danger Zone',
  dangerSubtitle: 'Actions that cannot be undone',
  deleteAccount: 'Delete account',
} as const;

export default async function SettingsPage() {
  const session = await requireAuth();
  const user = session.user as { name?: string | null; email: string; role?: string | null };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{STRINGS.pageTitle}</h2>
        <p className="text-sm text-muted-foreground">{STRINGS.pageSubtitle}</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-lg font-semibold">{STRINGS.profileTitle}</h3>
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
          <h3 className="text-lg font-semibold">{STRINGS.securityTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{STRINGS.securitySubtitle}</p>
          <div className="mt-4">
            <a
              href="/auth/reset-password"
              className="inline-flex items-center rounded-md border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
            >
              {STRINGS.changePassword}
            </a>
          </div>
        </div>

        {/* Account Section */}
        <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
          <h3 className="text-lg font-semibold text-destructive">{STRINGS.dangerTitle}</h3>
          <p className="mt-1 text-sm text-muted-foreground">{STRINGS.dangerSubtitle}</p>
          <div className="mt-4">
            <button
              type="button"
              className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20"
            >
              {STRINGS.deleteAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
