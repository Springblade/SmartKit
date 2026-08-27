// SePay polling cron — defense in depth on top of the webhook.
// Vercel Cron (vercel.json) hits this every 5 minutes with
// `Authorization: Bearer $CRON_SECRET` when the secret is configured.
//
// Two responsibilities per run:
//   1. Bulk-flip stale `pending` orders → `expired`.
//   2. Pull recent transactions from SePay and process any that the
//      webhook missed. Idempotency is enforced by the UNIQUE index on
//      `payment_transactions.sepay_transaction_id` — the same row is
//      rejected on the second insert (webhook or cron) and the loser
//      short-circuits with `already_processed`.

import { type NextRequest, NextResponse } from 'next/server';
import { listSepayTransactions } from '@/features/billing';
import { cancelExpiredOrders } from '@/features/billing/cancel-expired-orders';
import { processSepayPayload } from '@/features/billing/process-sepay-payload';
import { env } from '@/lib/env';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// SePay `/userapi/transactions/list` accepts date-only filters
// (`YYYY-MM-DD`). Query today's window, then narrow to the last
// `POLLING_LOOKBACK_MINUTES` minutes in memory — cheaper than
// re-fetching every minute and safe under MVP volume.
const POLLING_LOOKBACK_MINUTES = 10;

function verifyCronSecret(request: NextRequest): { ok: true } | { ok: false; reason: string } {
  // Production must have CRON_SECRET to prevent unauthorized cron triggers.
  if (env.NODE_ENV === 'production' && !env.CRON_SECRET) {
    return { ok: false, reason: 'cron_secret_not_configured' };
  }

  if (!env.CRON_SECRET) {
    console.warn('[cron] CRON_SECRET is not set in dev — endpoint is publicly callable locally');
    return { ok: true };
  }

  const header = request.headers.get('authorization');
  if (header !== `Bearer ${env.CRON_SECRET}`) {
    return { ok: false, reason: 'unauthorized' };
  }
  return { ok: true };
}

function dateOnly(date: Date): string {
  // YYYY-MM-DD in UTC. Matches SePay v1 userapi `from_date`/`to_date` filter.
  return date.toISOString().slice(0, 10);
}

interface ProcessResult {
  transactionId: string;
  status: 'completed' | 'already_processed' | 'ignored';
  reason?: string;
}

async function handle(request: NextRequest): Promise<NextResponse> {
  const auth = verifyCronSecret(request);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.reason }, { status: 401 });
  }

  if (!env.SEPAY_API_KEY) {
    return NextResponse.json({ error: 'SePay API key is not configured' }, { status: 503 });
  }

  const cancelled = await cancelExpiredOrders();

  const now = new Date();
  const lookbackMs = POLLING_LOOKBACK_MINUTES * 60 * 1000;
  const fromDate = new Date(now.getTime() - lookbackMs);

  // Fetch today's window from SePay; narrow to the lookback in-memory.
  // The API only accepts date granularity, so this is the cheapest way
  // to keep bandwidth small without re-querying per minute.
  const allTxs = await fetchRecentTransactions({
    accountNumber: env.SEPAY_BANK_ACCOUNT,
    fromDate: dateOnly(fromDate),
    toDate: dateOnly(now),
  });

  const fromTs = fromDate.getTime();
  const recent = allTxs.filter((tx) => {
    const ts = new Date(tx.transactionDate).getTime();
    return Number.isFinite(ts) && ts >= fromTs;
  });

  const results: ProcessResult[] = [];
  for (const tx of recent) {
    const result = await processSepayPayload(tx);
    results.push({
      transactionId: tx.id === null ? '' : String(tx.id),
      status: result.status,
      ...(result.status === 'ignored' ? { reason: result.reason } : {}),
    });
  }

  return NextResponse.json({
    cancelled: cancelled.cancelled,
    scanned: recent.length,
    processed: results.filter((r) => r.status !== 'ignored').length,
    results,
  });
}

// Vercel Cron dispatches as GET; some local tooling sends POST.
// Accept both to keep manual testing painless.
export { handle as GET, handle as POST };

async function fetchRecentTransactions(params: { accountNumber?: string; fromDate: string; toDate: string }) {
  const response = await listSepayTransactions({
    account_number: params.accountNumber,
    from_date: params.fromDate,
    to_date: params.toDate,
    limit: 100,
  });
  return response.data ?? [];
}
