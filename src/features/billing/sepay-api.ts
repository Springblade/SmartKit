import { env } from '@/lib/env';
import type { SepayTransactionListParams, SepayTransactionListResponse, SepayWebhookPayload } from './types';

const SEPAY_API_BASE_URL = 'https://api.sepay.vn/userapi';

/**
 * Fetch data from SePay API
 */
async function fetchSepay<T>(endpoint: string, params?: Record<string, string | number | undefined>): Promise<T> {
  if (!env.SEPAY_API_KEY) {
    throw new Error('SePay API key is not configured');
  }

  const url = new URL(`${SEPAY_API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: env.SEPAY_API_KEY,
    },
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`SePay API error: ${response.status} - ${text}`);
  }

  return response.json() as Promise<T>;
}

/**
 * List transactions from SePay
 * Used for polling as backup when webhooks miss
 */
export async function listSepayTransactions(
  params?: SepayTransactionListParams,
): Promise<SepayTransactionListResponse> {
  return fetchSepay<SepayTransactionListResponse>('/transactions/list', {
    account_number: params?.account_number,
    from_date: params?.from_date,
    to_date: params?.to_date,
    limit: params?.limit,
    offset: params?.offset,
  });
}

/**
 * Get transactions for a specific date range
 */
export async function getSepayTransactionsByDateRange(
  dateFrom: string,
  dateTo: string,
  accountNumber?: string,
): Promise<SepayWebhookPayload[]> {
  const response = await listSepayTransactions({
    account_number: accountNumber,
    from_date: dateFrom,
    to_date: dateTo,
    limit: 100,
  });

  return response.data || [];
}
