import { CreditCard, LayoutDashboard, Settings, Users } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { requireAuth } from '@/features/auth/lib/auth';
import { cn } from '@/lib/utils';
import { SignOutButton } from './sign-out-button';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await requireAuth();
  const user = session.user as {
    name?: string | null;
    email: string;
    role?: string | null;
  };
  const isAdmin = user.role === 'admin';

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-background">
        <div className="flex h-16 items-center border-b border-border px-6">
          <Link href="/dashboard" className="font-semibold text-lg text-foreground">
            SmartKit
          </Link>
        </div>
        <nav className="space-y-1 p-4">
          <SidebarNavLink href="/dashboard" icon={LayoutDashboard}>
            Dashboard
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/settings" icon={Settings}>
            Settings
          </SidebarNavLink>
          <SidebarNavLink href="/dashboard/billing" icon={CreditCard}>
            Billing
          </SidebarNavLink>
          {isAdmin && (
            <SidebarNavLink href="/dashboard/admin/users" icon={Users}>
              Users
            </SidebarNavLink>
          )}
        </nav>
        <div className="absolute bottom-4 left-0 w-64 px-4">
          <div className="rounded-lg border border-border bg-card p-3">
            <p className="text-sm font-medium text-card-foreground">{user.name ?? 'User'}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
            <div className="mt-2">
              <SignOutButton />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex-1">
        <header className="flex h-16 items-center justify-between border-b border-border bg-background px-6">
          <h1 className="text-lg font-medium text-foreground">Dashboard</h1>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            {isAdmin && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700 dark:bg-blue-900 dark:text-blue-200">
                Admin
              </span>
            )}
          </div>
        </header>
        <div className="bg-background p-6">{children}</div>
      </main>
    </div>
  );
}

function SidebarNavLink({
  href,
  icon: Icon,
  children,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <Icon className="h-5 w-5" />
      {children}
    </Link>
  );
}
