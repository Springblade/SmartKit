import 'server-only';

export const ROLES = {
  ADMIN: 'admin' as const,
  USER: 'user' as const,
} as const;

type Role = (typeof ROLES)[keyof typeof ROLES];

export function checkRole(user: { role?: Role | string | null } | null | undefined, required: Role): boolean {
  if (!user) return false;
  return user.role === required;
}

export function isAdmin(user: { role?: Role | string | null } | null | undefined): boolean {
  return checkRole(user, ROLES.ADMIN);
}
