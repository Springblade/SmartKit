'use client';

import { AlertCircle, CheckCircle2, LoaderCircle, RefreshCw } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cancelOrder } from '../actions/cancel-order';
import { generatePaymentQRAction } from '../actions/generate-payment-qr';
import { usePaymentPolling } from '../hooks/usePaymentPolling';

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

export function PaymentSection({ order, plan }: PaymentSectionProps) {
  const router = useRouter();
  const { orderStatus, isLoading: isPolling, error: pollingError, refetch } = usePaymentPolling(order.id);
  const [timeLeft, setTimeLeft] = useState<string>('');
  const [isCancelling, setIsCancelling] = useState(false);
  const [cancelError, setCancelError] = useState<string | null>(null);
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);

  useEffect(() => {
    async function generateQR() {
      setQrError(null);
      const result = await generatePaymentQRAction(order.code, order.amountVnd);
      if (result.success && result.qrUrl) {
        setQrUrl(result.qrUrl);
        return;
      }

      setQrError(result.error ?? 'Không thể tạo mã QR thanh toán.');
    }

    generateQR();
  }, [order.code, order.amountVnd]);

  useEffect(() => {
    function calculateTimeLeft() {
      const expiresAt = new Date(order.expiresAt);
      const now = new Date();
      const diff = expiresAt.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('0:00');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [order.expiresAt]);

  const handleCancel = async () => {
    if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

    setCancelError(null);
    setIsCancelling(true);
    try {
      await cancelOrder(order.id);
      router.push('/dashboard/billing');
      router.refresh();
    } catch (error) {
      setCancelError(error instanceof Error ? error.message : 'Không thể hủy đơn hàng.');
      setIsCancelling(false);
    }
  };

  const isExpired = timeLeft === '0:00' || orderStatus?.status === 'expired';
  const isCompleted = orderStatus?.status === 'completed';
  const isCancelled = orderStatus?.status === 'cancelled';

  if (isCompleted) {
    return (
      <div className="rounded-xl border border-green-500/50 bg-green-50/50 p-8 text-center dark:bg-green-950/20">
        <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-green-600 dark:text-green-400" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-green-700 dark:text-green-200">Thanh toán thành công!</h3>
        <p className="mt-2 text-muted-foreground">
          Bạn đã đăng ký thành công gói <strong>{plan.name}</strong>.
        </p>
        <button
          type="button"
          onClick={() => {
            router.push('/dashboard/billing');
            router.refresh();
          }}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Về trang billing
        </button>
      </div>
    );
  }

  if (isCancelled || isExpired) {
    const message = isCancelled ? 'Đơn hàng đã được hủy.' : 'Đơn hàng đã hết hạn.';

    return (
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-8 text-center dark:border-red-900 dark:bg-red-950/20">
        <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-600 dark:text-red-400" aria-hidden="true" />
        <h3 className="text-xl font-semibold text-red-700 dark:text-red-200">Không thể tiếp tục thanh toán</h3>
        <p className="mt-2 text-muted-foreground">{message}</p>
        <button
          type="button"
          onClick={() => router.push('/dashboard/billing')}
          className="mt-6 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Chọn gói khác
        </button>
      </div>
    );
  }

  return (
    <div className="rounded-xl border bg-card p-6">
      <h3 className="text-lg font-semibold">Thông tin thanh toán</h3>

      {pollingError && (
        <div className="mt-4 flex items-center justify-between gap-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/30 dark:text-amber-200">
          <span>Không thể cập nhật trạng thái thanh toán. Vui lòng thử lại.</span>
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex shrink-0 items-center gap-2 font-medium underline underline-offset-4"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Thử lại
          </button>
        </div>
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
                alt="QR Code thanh toán"
                width={192}
                height={192}
                className="h-48 w-48 object-contain"
                unoptimized
              />
            ) : qrError ? (
              <div className="flex h-48 w-48 flex-col items-center justify-center gap-3 px-4 text-center text-sm text-destructive">
                <AlertCircle className="h-8 w-8" aria-hidden="true" />
                <p>{qrError}</p>
              </div>
            ) : (
              <div className="flex h-48 w-48 items-center justify-center">
                <LoaderCircle className="h-8 w-8 animate-spin text-primary" aria-label="Đang tạo mã QR" />
              </div>
            )}
          </div>
          {isPolling && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <LoaderCircle className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              Đang kiểm tra thanh toán...
            </div>
          )}
        </div>

        {/* Payment Details */}
        <div className="flex flex-1 flex-col gap-4">
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Gói đăng ký</p>
            <p className="text-lg font-semibold">{plan.name}</p>
            <p className="mt-1 text-2xl font-bold text-primary">{order.amountVnd.toLocaleString('vi-VN')} VND</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Nội dung chuyển khoản</p>
            <p className="font-mono font-medium">{order.content}</p>
          </div>

          <div className="rounded-lg bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Mã đơn hàng</p>
            <p className="font-mono text-sm">{order.code}</p>
          </div>

          <div
            className={`rounded-lg p-4 text-center ${isExpired ? 'bg-red-50 dark:bg-red-950/30' : 'bg-yellow-50 dark:bg-yellow-950/30'}`}
          >
            <p className="text-sm text-muted-foreground">Thời gian còn lại</p>
            <p
              className={`text-2xl font-bold ${isExpired ? 'text-red-600 dark:text-red-400' : 'text-yellow-600 dark:text-yellow-400'}`}
            >
              {timeLeft}
            </p>
            {isExpired && <p className="mt-1 text-sm text-red-600 dark:text-red-400">Đơn hàng đã hết hạn</p>}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          disabled={isCancelling}
          className="rounded-lg border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
        >
          {isCancelling ? 'Đang hủy...' : 'Hủy đơn'}
        </button>
      </div>
    </div>
  );
}
