import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { getPaymentToneClasses, type PaymentTone } from '../lib/status-styles';

export interface PaymentAlertProps {
  tone: PaymentTone;
  icon: LucideIcon;
  title: ReactNode;
  body?: ReactNode;
  variant?: 'panel' | 'banner';
  action?: ReactNode;
}

const PANEL_LAYOUT = 'p-8 text-center';
const BANNER_LAYOUT = 'mt-4 flex items-center justify-between gap-4 p-3 text-sm';

export function PaymentAlert({ tone, icon: Icon, title, body, variant = 'panel', action }: PaymentAlertProps) {
  const classes = getPaymentToneClasses(tone);
  const layout = variant === 'panel' ? PANEL_LAYOUT : BANNER_LAYOUT;

  const iconSize = variant === 'panel' ? 'h-16 w-16 mx-auto mb-4' : 'h-4 w-4 shrink-0';
  const titleSize = variant === 'panel' ? 'text-xl font-semibold' : 'font-medium';

  return (
    <div
      className={`${classes.container} ${layout}`}
      role={tone === 'error' || tone === 'warning' ? 'alert' : 'status'}
    >
      <Icon className={`${iconSize} ${classes.icon}`} aria-hidden="true" />
      <div className={variant === 'banner' ? 'flex-1' : undefined}>
        <div className={`${titleSize} ${classes.title}`}>{title}</div>
        {body && <div className={`${variant === 'panel' ? 'mt-2' : 'mt-1'} ${classes.body}`}>{body}</div>}
      </div>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
