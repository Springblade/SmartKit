type DatabaseError = {
  code?: string;
  constraint?: string;
  message?: string;
};

export function isPendingOrderConflict(error: unknown): boolean {
  const databaseError = getDatabaseError(error);
  if (databaseError?.code !== '23505') return false;
  return (
    databaseError.constraint === 'orders_user_plan_pending_idx' ||
    databaseError.message?.includes('orders_user_plan_pending_idx') === true
  );
}

export function getDatabaseErrorCode(error: unknown): string | undefined {
  return getDatabaseError(error)?.code;
}

export function getDatabaseErrorConstraint(error: unknown): string | undefined {
  return getDatabaseError(error)?.constraint;
}

function getDatabaseError(error: unknown): DatabaseError | null {
  if (!error || typeof error !== 'object') return null;

  const current = error as DatabaseError & { cause?: unknown };
  if (current.code || current.constraint) return current;

  const causeError = getDatabaseError(current.cause);
  if (causeError) return causeError;

  return current.message ? current : null;
}
