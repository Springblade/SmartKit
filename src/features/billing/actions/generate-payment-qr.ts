'use server';

import { BillingError } from '../errors';
import { generatePaymentQR, isSepayQRConfigured } from '../sepay';

export async function generatePaymentQRAction(
  orderCode: string,
  amount: number,
): Promise<{ success: boolean; qrUrl?: string; error?: string }> {
  if (!isSepayQRConfigured()) {
    return {
      success: false,
      error: new BillingError('SEPAY_NOT_CONFIGURED').userMessage,
    };
  }

  try {
    const qrUrl = generatePaymentQR(orderCode, amount);
    return { success: true, qrUrl };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate QR',
    };
  }
}
