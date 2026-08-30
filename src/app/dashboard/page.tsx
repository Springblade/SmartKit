import { requireAuth } from '@/features/auth/lib/auth';

const STRINGS = {
  greeting: (name: string | null | undefined) => `Hello, ${name ?? 'User'}!`,
  welcomeBack: 'Welcome back to SmartKit',
  cards: {
    account: { title: 'Account', description: 'Manage your profile and security' },
    billing: { title: 'Billing', description: 'View and manage your subscription' },
    users: { title: 'Users', description: 'Manage user accounts' },
  },
  quickActionsTitle: 'Quick Actions',
  updateProfile: 'Update profile',
  viewPlans: 'View plans',
} as const;

export default async function DashboardPage() {
  const session = await requireAuth();
  const user = session.user as { name?: string | null; role?: string | null };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{STRINGS.greeting(user.name)}</h2>
        <p className="text-muted-foreground">{STRINGS.welcomeBack}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card
          title={STRINGS.cards.account.title}
          description={STRINGS.cards.account.description}
          href="/dashboard/settings"
        />
        <Card
          title={STRINGS.cards.billing.title}
          description={STRINGS.cards.billing.description}
          href="/dashboard/billing"
        />
        {user.role === 'admin' && (
          <Card
            title={STRINGS.cards.users.title}
            description={STRINGS.cards.users.description}
            href="/dashboard/admin/users"
          />
        )}
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-lg font-semibold">{STRINGS.quickActionsTitle}</h3>
        <div className="mt-4 flex flex-wrap gap-3">
          <a
            href="/dashboard/settings"
            className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            {STRINGS.updateProfile}
          </a>
          <a
            href="/dashboard/billing"
            className="rounded-lg border bg-background px-4 py-2 text-sm font-medium hover:bg-accent"
          >
            {STRINGS.viewPlans}
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
