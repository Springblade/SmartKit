import { getSessionCookie } from 'better-auth/cookies';
import { type NextRequest, NextResponse } from 'next/server';
import { auth } from '@/features/auth';
import { isAdmin } from '@/features/auth/lib/permissions';

export async function proxy(request: NextRequest) {
  // Optimistic auth check: only verify the session cookie exists at the edge
  // to avoid a DB hit on every navigation. Full session validation lives in
  // the (dashboard) layout's server-rendered guard.
  const hasSession = Boolean(getSessionCookie(request));

  if (!hasSession) {
    const redirectTo = request.nextUrl.pathname + request.nextUrl.search;
    return NextResponse.redirect(new URL(`/auth/sign-in?redirectTo=${redirectTo}`, request.url));
  }

  // Protect all non-auth, non-public routes. The (dashboard) route group
  // shares a layout for /, /billing, /admin/*, /billing/* etc., so the
  // matcher covers every protected URL with a single rule.
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!isAdmin(session?.user as { role?: string | null })) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // Match every URL except: auth pages, api routes, Next internals, and root homepage.
  matcher: ['/((?!auth|api|_next/static|_next/image|favicon.ico|$).*)'],
};
