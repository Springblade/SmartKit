// Server-only exports - DO NOT import in Client Components
export { authConfig } from '../auth.config';
export {
  auth,
  getSession,
  isAdmin,
  requireAdmin,
  requireAuth,
} from './auth';
export { sendEmail } from './email';
export { checkRole, ROLES } from './permissions';
