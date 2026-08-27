'use server';

import { env } from '@/lib/env';
import { BillingError } from '../errors';
import { processSepayTransaction } from '../process-transaction';
import { isSepayConfigured } from '../sepay';
import { getSepayTransactionsByDateRange } from '../sepay-api';
import type { SepayTransaction } from '../types';

export async function getSepayTransactionsAction(
  dateFrom: string,
  dateTo: string,
  accountNumber?: string,
): Promise<{ success: boolean; transactions?: SepayTransaction[]; error?: string }> {
  if (!isSepayConfigured()) {
    return {
      success: false,
      error: new BillingError('SEPAY_NOT_CONFIGURED').userMessage,
    };
  }

  try {
    const transactions = await getSepayTransactionsByDateRange(
      dateFrom,
      dateTo,
      accountNumber || env.SEPAY_BANK_ACCOUNT,
    );

    const processed = transactions.map(processSepayTransaction).filter((tx): tx is SepayTransaction => tx !== null);

    return { success: true, transactions: processed };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch transactions',
    };
  }
}
