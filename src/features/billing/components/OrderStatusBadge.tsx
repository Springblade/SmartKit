import { Badge, type BadgeVariant } from '@/components/ui';

const STRINGS = {
  paid: 'Paid',
  pending: 'Pending',
  expired: 'Expired',
  cancelled: 'Cancelled',
} as const;

export type OrderStatus = 'pending' | 'completed' | 'expired' | 'cancelled';

const STATUS_LABEL: Record<OrderStatus, string> = {
  completed: STRINGS.paid,
  pending: STRINGS.pending,
  expired: STRINGS.expired,
  cancelled: STRINGS.cancelled,
};

const STATUS_VARIANT: Record<OrderStatus, BadgeVariant> = {
  completed: 'default',
  pending: 'secondary',
  expired: 'destructive',
  cancelled: 'outline',
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Badge>;
}
