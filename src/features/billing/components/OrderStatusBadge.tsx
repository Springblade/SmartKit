import { Badge, type BadgeVariant } from '@/components/ui';

export type OrderStatus = 'pending' | 'completed' | 'expired' | 'cancelled';

const STATUS_LABEL: Record<OrderStatus, string> = {
  completed: 'Đã thanh toán',
  pending: 'Đang chờ',
  expired: 'Hết hạn',
  cancelled: 'Đã hủy',
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
