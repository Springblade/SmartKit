'use client';

import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { cancelOrder } from '../actions/cancel-order';
import { useOrderTimer } from '../hooks/useOrderTimer';
import { usePaymentPolling } from '../hooks/usePaymentPolling';
import { usePaymentQR } from '../hooks/usePaymentQR';
import { PaymentAlert } from './PaymentAlert';

const STRINGS = {
  paymentInfoTitle: 'Payment Information',
  subscriptionPlan: 'Subscription plan',
  transferContent: 'Transfer content',
  orderCode: 'Order code',
  timeRemaining: 'Time remaining',
  cancelButton: 'Cancel',
  cancellingButton: 'Cancelling...',
  successTitle: 'Payment Successful!',
  successBody: (planName: string) => `You have successfully subscribed to the ${planName} plan.`,
  backToBilling: 'Back to billing',
  cannotContinueTitle: 'Unable to Continue Payment',
  cannotContinue: (message: string) => message,
  cancelledBody: 'This order has been cancelled.',
  expiredBody: 'This order has expired.',
  selectDifferentPlan: 'Select a different plan',
  qrError: 'Could not generate QR code.',
  pollingError: 'Unable to update payment status. Please try again.',
  retry: 'Retry',
  generatingQR: 'Generating QR code...',
  checkingPayment: 'Checking for payment...',
  cancelConfirm: 'Are you sure you want to cancel this order?',
  cancelError: 'Could not cancel the order.',
  orderExpired: 'Order expired',
  qrAltText: 'Payment QR code',
} as const;

interface OrderData {
  id: string;
  code: string;
  content: string;
  amountVnd: number;
  expiresAt: string;
}

interface PlanData {
  id: string;
  name: string;
  priceVnd: number;
}

interface PaymentSectionProps {
  order: OrderData;
  plan: PlanData;
}

const PRIMARY_BUTTON =
  'mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90';
const SECONDARY_BUTTON =
  'rounded-lg border bg-card px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground';

export function PaymentSection({ order, plan }: PaymentSectionProps) {
  const router = useRouter();
  const { orderStatus, isLoading: isPolling, error: pollingError, refetch } = usePaymentPolling(order.id);
  const { qrUrl, qrError } = usePaymentQR(order.code, order.amountVnd);
  const { timeLeft, isExpired: isTimerExpired } = useOrderTimer(order.expiresAt);
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);

  const handleCancel = async () => {
    if (!confirm(STRINGS.cancelConfirm)) return;

    setCancelError(null);
    setIsCancelling(true);
    try {
      await cancelOrder(order.id);
      router.push('/dashboard/billing');
      router.refresh();
    } catch (_error) {
      setCancelError(STRINGS.cancelError);
      setIsCancelling(false);
    }
  };

  const isExpired = isTimerExpired || orderStatus?.status === 'expired';
  const isCompleted = orderStatus?.status === 'completed';
  const isCancelled = orderStatus?.status === 'cancelled';

  if (isCompleted) {
    return (
      <PaymentAlert
        tone="success"
        icon={CheckCircle2}
        title={STRINGS.successTitle}
        body={STRINGS.successBody(plan.name)}
        action={
          <button
            type="button"
            onClick={() => {
              router.push('/dashboard/billing');
              router.refresh();
            }}
            className={PRIMARY_BUTTON}
          >
            {STRINGS.backToBilling}
          </button>
        }
      />
    );
  }

  if (isCancelled || isExpired) {
    const message = isCancelled ? STRINGS.cancelledBody : STRINGS.expiredBody;
    return (
      <PaymentAlert
        tone="error"
        icon={AlertCircle}
        title={STRINGS.cannotContinueTitle}
        body={STRINGS.cannotContinue(message)}
        action={
          <button type="button" onClick={() => router.push('/dashboard/billing')} className={PRIMARY_BUTTON}>
            {STRINGS.selectDifferentPlan}
          </button>
        }
      />
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold">{STRINGS.paymentInfoTitle}</h3>

      {pollingError && (
        <PaymentAlert
          tone="warning"
          icon={AlertCircle}
          title={STRINGS.pollingError}
          variant="banner"
          action={
            <button
              type="button"
              onClick={() => void refetch()}
              className="inline-flex shrink-0 items-center gap-2 font-medium underline underline-offset-4"
            >
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              {STRINGS.retry}
            </button>
          }
        />
      )}

      {cancelError && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/30 dark:text-red-200">
          {cancelError}
        </div>
      )}

      <div className="mt-4 flex flex-col gap-6 sm:flex-row">
        {/* QR Code */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative rounded-lg border bg-white p-4">
            {qrUrl ? (
              <Image
                src={qrUrl}
                alt={STRINGS.qrAltText}
                width={192}
                height={192}
                className="h-48 w-48 object-contain"
                unoptimized
              />
            ) : qrError ? (
              <div className="flex h-48 w-48 flex-col items-center justify-center gap-3 px-4 text-center text-sm text-destructive">
                <AlertCircle className="h-8 w-8" aria-hidden="true" />
                <p>{STRINGS.qrError}</p>
              </div>
            ) : (
              <div className="flex h-48 w-48 items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-label={STRINGS.generatingQR} />
              </div>
            )}
          </div>
          {isPolling && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              {STRINGS.checkingPayment}
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{STRINGS.subscriptionPlan}</p>
            <p className="text-lg font-semibold">{plan.name}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{order.amountVnd.toLocaleString('vi-VN')} VND</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{STRINGS.transferContent}</p>
            <p className="font-mono font-medium">{order.content}</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">{STRINGS.orderCode}</p>
            <p className="font-mono text-sm">{order.code}</p>
          </div>

          <TimerCard timeLeft={timeLeft} isExpired={isExpired} />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button type="button" onClick={handleCancel} disabled={isCancelling} className={SECONDARY_BUTTON}>
          {isCancelling ? STRINGS.cancellingButton : STRINGS.cancelButton}
        </button>
      </div>
    </div>
  );
}

interface TimerCardProps {
  timeLeft: string;
  isExpired: boolean;
}

function TimerCard({ timeLeft, isExpired }: TimerCardProps) {
  return (
    <div
      className={`rounded-lg p-4 text-center ${
        isExpired ? 'bg-red-50 dark:bg-red-950/30' : 'bg-yellow-50 dark:bg-yellow-950/30'
      }`}
    >
      <p className="text-sm text-muted-foreground">{STRINGS.timeRemaining}</p>
      <p
        className={`text-2xl font-bold ${
          isExpired ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'
        }`}
      >
        {timeLeft}
      </p>
      {isExpired && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{STRINGS.orderExpired}</p>}
    </div>
  );
}
