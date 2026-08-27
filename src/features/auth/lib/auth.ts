import { betterAuth } from 'better-auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
import { authConfig } from '../auth.config';
import { isAdmin } from './permissions';
import 'server-only';

export { authConfig };

export const auth = betterAuth(authConfig);

/**
 * Cached per-request session lookup. React's `cache` deduplicates calls within
 * the same request (e.g. proxy + layout both calling getSession).
 */
export const getSession = cache(async () => {
  return auth.api.getSession({ headers: await headers() });
});

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/sign-in');
  }
  return session;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session?.user) {
    redirect('/auth/sign-in');
  }
  if (!isAdmin(session.user as { role?: string | null })) {
    redirect('/auth/sign-in');
  }
  return session;
}

export { isAdmin };

export const listSessions = auth.api.listSessions;
export const revokeSession = auth.api.revokeSession;
export const revokeOtherSessions = auth.api.revokeOtherSessions;
