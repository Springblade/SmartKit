import { createHmac, timingSafeEqual } from 'node:crypto';
import { env } from '@/lib/env';
import type { SepayWebhookPayload } from './types';
import { SepayWebhookPayloadSchema } from './types';

/**
 * Maximum age (in seconds) allowed for a webhook timestamp.
 * Requests older than this are rejected to prevent replay attacks.
 */
const MAX_TIMESTAMP_DRIFT_SECONDS = 300;

// We accept bare hex for safety — SePay may drop the prefix in some edge cases.
function stripSignaturePrefix(signature: string): string {
  return signature.startsWith('sha256=') ? signature.slice('sha256='.length) : signature;
}

/**
 * SePay spec (2024):
 *  - Signed string: `${timestamp}.${rawBody}`
 *  - Signature header: `X-SePay-Signature: sha256={hex_hash}`
 *  - Timestamp header: `X-SePay-Timestamp: {unix_seconds}`
 *  - Anti-replay: reject if `|now - timestamp| > 300s`
 */
export function verifySepaySignature(
  rawBody: string,
  signature: string,
  timestamp: string | number,
  secret?: string,
): boolean {
  const webhookSecret = secret || env.SEPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error('SePay webhook secret is not configured');
  }

  // Validate timestamp presence + anti-replay window
  const ts = Number(timestamp);
  if (!timestamp || Number.isNaN(ts) || ts <= 0) {
    throw new Error('SePay webhook timestamp is missing or invalid');
  }

  const nowInSeconds = Date.now() / 1000;
  if (Math.abs(nowInSeconds - ts) > MAX_TIMESTAMP_DRIFT_SECONDS) {
    throw new Error('SePay webhook timestamp is outside the allowed 5-minute window');
  }

  const signedString = `${ts}.${rawBody}`;
  const expected = createHmac('sha256', webhookSecret).update(signedString).digest('hex');
  const received = stripSignaturePrefix(signature);

  if (received.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(Buffer.from(received, 'hex'), Buffer.from(expected, 'hex'));
}

/**
 * Returns null if validation fails.
 */
export function parseSepayWebhookPayload(rawBody: string): SepayWebhookPayload | null {
  try {
    const json = JSON.parse(rawBody);
    const result = SepayWebhookPayloadSchema.safeParse(json);

    if (!result.success) {
      console.error('SePay webhook payload validation failed:', result.error);
      return null;
    }

    return result.data;
  } catch (error) {
    console.error('Failed to parse SePay webhook payload:', error);
    return null;
  }
}

/**
 * Returns null if verification or parsing fails.
 */
export function verifyAndParseWebhook(
  rawBody: string,
  signature: string,
  timestamp: string | number,
): SepayWebhookPayload | null {
  let verified = false;
  try {
    verified = verifySepaySignature(rawBody, signature, timestamp);
  } catch (error) {
    console.error('SePay webhook signature verification failed:', error);
    return null;
  }

  if (!verified) {
    console.error('SePay webhook signature verification failed');
    return null;
  }

  return parseSepayWebhookPayload(rawBody);
}
