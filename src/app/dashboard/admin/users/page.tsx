import { desc, sql } from 'drizzle-orm';
import { db } from '@/database/db';
import { session as sessionTable, user } from '@/database/schema';
import { requireAdmin } from '@/features/auth/lib/auth';

const STRINGS = {
  pageTitle: 'User Management',
  pageSubtitle: (adminEmail: string) => `View and manage user accounts (Admin: ${adminEmail})`,
  totalUsers: (count: number) => `Total users: ${count}`,
} as const;

export default async function AdminUsersPage() {
  const currentSession = await requireAdmin();

  // Get all users
  const allUsers = await db.query.user.findMany({
    orderBy: [desc(user.createdAt)],
  });

  // Get session counts per user in a single query
  const sessionCounts = await db
    .select({
      userId: sessionTable.userId,
      count: sql<number>`count(*)::int`,
    })
    .from(sessionTable)
    .groupBy(sessionTable.userId);

  const sessionCountMap = new Map(sessionCounts.map((r) => [r.userId, r.count]));

  // Attach session count to each user
  const usersWithSessionCount = allUsers.map((u) => ({
    ...u,
    sessionCount: sessionCountMap.get(u.id) ?? 0,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{STRINGS.pageTitle}</h2>
        <p className="text-zinc-500 dark:text-zinc-400">{STRINGS.pageSubtitle(currentSession.user.email)}</p>
      </div>

      <div className="rounded-lg border">
        <table className="w-full">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Role</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Verified</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Sessions</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Created</th>
            </tr>
          </thead>
          <tbody>
            {usersWithSessionCount.map((u) => (
              <tr key={u.id} className="border-b last:border-0">
                <td className="px-4 py-3 text-sm">{u.name}</td>
                <td className="px-4 py-3 text-sm">{u.email}</td>
                <td className="px-4 py-3 text-sm">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      u.role === 'admin'
                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200'
                        : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  {u.emailVerified ? (
                    <span className="text-green-600">Yes</span>
                  ) : (
                    <span className="text-zinc-400">No</span>
                  )}
                </td>
                <td className="px-4 py-3 text-sm">{u.sessionCount}</td>
                <td className="px-4 py-3 text-sm">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-sm text-zinc-500">{STRINGS.totalUsers(allUsers.length)}</div>
    </div>
  );
}
