// SePay webhook handler.
// Receives POST from SePay's bank monitoring when a user's
// transfer matches the QR content. Verifies HMAC-SHA256 signature
// against `${timestamp}.${rawBody}` with a 5-minute anti-replay
// window, writes an audit row to `payment_transactions`, and
// flips the matching order to `completed`.
//
// Idempotency is enforced by the UNIQUE index on
// `payment_transactions.sepay_transaction_id`: re-deliveries land
// on `ON CONFLICT DO NOTHING` and skip business logic.
//
// See: docs/phases/02-phase-2-billing/04-webhook.md
//      https://developer.sepay.vn/vi/sepay-webhooks/lap-trinh-webhook

import { nanoid } from 'nanoid';
import { type NextRequest, NextResponse } from 'next/server';
import { db } from '@/database/db';
import { paymentTransactions } from '@/database/schema';
import { extractOrderCode, parseSepayWebhookPayload, verifySepaySignature } from '@/features/billing';
import { recordPaymentTransaction } from '@/features/billing/payment-transactions';
import { processOrderCompletion } from '@/features/billing/process-order-completion';

export const runtime = 'nodejs';

const REJECTED_BAD_SIGNATURE = 'REJECTED_BAD_SIGNATURE';
const REJECTED_EXPIRED_TIMESTAMP = 'REJECTED_EXPIRED_TIMESTAMP';
const REJECTED_INVALID_PAYLOAD = 'REJECTED_INVALID_PAYLOAD';

async function auditReject(rawBody: string, content: string) {
  await db.insert(paymentTransactions).values({
    id: nanoid(),
    orderId: null,
    sepayTransactionId: null,
    amountVnd: '0',
    content,
    rawPayload: rawBody,
  });
}

export async function POST(request: NextRequest) {
  const rawBody = await request.text();

  const signature = request.headers.get('x-sepay-signature');
  const timestampHeader = request.headers.get('x-sepay-timestamp');

  if (!signature) {
    await auditReject(rawBody, REJECTED_BAD_SIGNATURE);
    return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
  }

  if (!timestampHeader) {
    await auditReject(rawBody, REJECTED_BAD_SIGNATURE);
    return NextResponse.json({ error: 'Missing timestamp' }, { status: 401 });
  }

  let signatureValid = false;
  try {
    signatureValid = verifySepaySignature(rawBody, signature, timestampHeader);
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    const isExpired = message.includes('outside the allowed');
    await auditReject(rawBody, isExpired ? REJECTED_EXPIRED_TIMESTAMP : REJECTED_BAD_SIGNATURE);
    return NextResponse.json({ error: message || 'Verification failed' }, { status: 401 });
  }

  if (!signatureValid) {
    await auditReject(rawBody, REJECTED_BAD_SIGNATURE);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const payload = parseSepayWebhookPayload(rawBody);
  if (!payload) {
    await auditReject(rawBody, REJECTED_INVALID_PAYLOAD);
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  }

  if (payload.id === null) {
    // SePay occasionally sends `id: null` — we have no transaction key
    // to dedupe on, so capture the audit row and bail out of business logic.
    await recordPaymentTransaction({ payload, rawBody });
    return NextResponse.json({ status: 'ignored', reason: 'no_transaction_id' });
  }

  if (payload.transferType !== 'in') {
    await recordPaymentTransaction({ payload, rawBody });
    return NextResponse.json({ status: 'ignored', reason: 'outbound' });
  }

  const orderCode = extractOrderCode(payload.content);
  if (!orderCode) {
    await recordPaymentTransaction({ payload, rawBody });
    return NextResponse.json({ status: 'ignored', reason: 'no_order_code' });
  }

  const { recorded } = await recordPaymentTransaction({ payload, rawBody }, { skipOnConflict: true });
  if (!recorded) {
    return NextResponse.json({ status: 'already_processed' });
  }

  const result = await processOrderCompletion({
    sepayTransactionId: payload.id,
    transferAmount: payload.transferAmount,
    orderCode,
  });

  return NextResponse.json(result);
}
