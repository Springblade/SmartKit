import { env } from '@/lib/env';
import type { SepayQRParams } from './types';

const SEPAY_QR_BASE_URL = 'https://qr.sepay.vn/img';

/**
 * Generate SePay QR code image URL
 * User scans this QR with their banking app to make payment
 */
export function generateSepayQRUrl(params: SepayQRParams): string {
  const { account, bank, amount, content } = params;

  const url = new URL(SEPAY_QR_BASE_URL);
  url.searchParams.set('bank', bank);
  url.searchParams.set('acc', account);
  url.searchParams.set('amount', amount.toString());
  url.searchParams.set('des', content);

  return url.toString();
}

/**
 * Generate QR URL using configured bank account from env
 */
export function generatePaymentQR(orderCode: string, amount: number): string {
  if (!env.SEPAY_BANK_ACCOUNT || !env.SEPAY_BANK_NAME) {
    throw new Error('SePay is not configured. Set SEPAY_BANK_ACCOUNT and SEPAY_BANK_NAME in .env');
  }

  return generateSepayQRUrl({
    account: env.SEPAY_BANK_ACCOUNT,
    bank: env.SEPAY_BANK_NAME,
    amount,
    content: `SK ${orderCode}`,
  });
}

/**
 * Check whether enough bank details are available to generate a VietQR image.
 */
export function isSepayQRConfigured(): boolean {
  return !!(env.SEPAY_BANK_ACCOUNT && env.SEPAY_BANK_NAME);
}

/**
 * Check if SePay is configured and ready to use
 */
export function isSepayConfigured(): boolean {
  return !!(env.SEPAY_API_KEY && env.SEPAY_WEBHOOK_SECRET && isSepayQRConfigured());
}
