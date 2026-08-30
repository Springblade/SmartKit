'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { checkOrderStatus } from '../actions/check-order-status';
import { POLL_INTERVAL_MS } from '../config';

interface OrderStatus {
  id: string;
  status: 'pending' | 'completed' | 'cancelled' | 'expired';
  expiresAt: string;
  completedAt: string | null;
}

interface UsePaymentPollingResult {
  orderStatus: OrderStatus | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function usePaymentPolling(orderId: string): UsePaymentPollingResult {
  const [orderStatus, setOrderStatus] = useState<OrderStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setError(null);
      const result = await checkOrderStatus(orderId);
      setOrderStatus(result as OrderStatus);

      if (result.status === 'completed' || result.status === 'cancelled' || result.status === 'expired') {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order status');
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchStatus();

    intervalRef.current = setInterval(fetchStatus, POLL_INTERVAL_MS);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [fetchStatus]);

  return {
    orderStatus,
    isLoading,
    error,
    refetch: fetchStatus,
  };
}
