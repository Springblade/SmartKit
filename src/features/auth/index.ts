// Client-only exports - import only in Client Components
export { authClient, signIn, signOut, signUp, useSession } from './client';
export { ResetPasswordEmail, VerificationEmail, WelcomeEmail } from './emails';
// Server-only exports - import only in Server Components / Server Actions
export {
  auth,
  authConfig,
  getSession,
  isAdmin,
  requireAdmin,
  requireAuth,
} from './lib';

export { ROLES } from './lib/permissions';

export type { AuthUser, LoginCredentials, RegisterCredentials } from './types';
