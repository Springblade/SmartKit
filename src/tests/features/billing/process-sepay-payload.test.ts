import { beforeEach, describe, expect, it, vi } from 'vitest';
import { processSepayPayload } from '@/features/billing/process-sepay-payload';

const recordPaymentTransaction = vi.fn<() => Promise<{ recorded: boolean }>>();
const processOrderCompletion = vi.fn();

vi.mock('@/features/billing/payment-transactions', () => ({
  recordPaymentTransaction: (...args: Parameters<typeof recordPaymentTransaction>) =>
    recordPaymentTransaction(...args),
}));

vi.mock('@/features/billing/process-order-completion', () => ({
  processOrderCompletion: (...args: Parameters<typeof processOrderCompletion>) =>
    processOrderCompletion(...args),
}));

describe('processSepayPayload', () => {
  beforeEach(() => {
    recordPaymentTransaction.mockReset();
    processOrderCompletion.mockReset();
  });

  it('audits and ignores payloads without transaction id', async () => {
    const result = await processSepayPayload({
      id: null,
      transferType: 'in',
      transferAmount: 100000,
      content: 'SK abc12345',
    });

    expect(result).toEqual({ status: 'ignored', reason: 'no_transaction_id' });
    expect(recordPaymentTransaction).toHaveBeenCalledTimes(1);
    expect(processOrderCompletion).not.toHaveBeenCalled();
  });

  it('audits and ignores outbound transfers', async () => {
    const result = await processSepayPayload({
      id: 42,
      transferType: 'out',
      transferAmount: 100000,
      content: 'SK abc12345',
    });

    expect(result).toEqual({ status: 'ignored', reason: 'outbound' });
    expect(recordPaymentTransaction).toHaveBeenCalledTimes(1);
    expect(processOrderCompletion).not.toHaveBeenCalled();
  });

  it('returns already_processed when audit insert conflicts', async () => {
    recordPaymentTransaction.mockResolvedValueOnce({ recorded: false });

    const result = await processSepayPayload({
      id: 42,
      transferType: 'in',
      transferAmount: 100000,
      content: 'SK abc12345',
    });

    expect(result).toEqual({ status: 'already_processed' });
    expect(recordPaymentTransaction).toHaveBeenCalledTimes(1);
    expect(processOrderCompletion).not.toHaveBeenCalled();
  });

  it('delegates actionable inbound transfers to processOrderCompletion', async () => {
    recordPaymentTransaction.mockResolvedValueOnce({ recorded: true });
    processOrderCompletion.mockResolvedValueOnce({
      status: 'completed',
      orderId: 'order-1',
      planId: 'plan-1',
      userId: 'user-1',
    });

    const auditPayload = {
      id: 42,
      gateway: 'test',
      transactionDate: '2026-01-01',
      accountNumber: '123',
      content: 'SK abc12345',
      transferType: 'in' as const,
      transferAmount: 100000,
      reference: 'ref',
      description: 'desc',
    };

    const result = await processSepayPayload(
      {
        id: 42,
        transferType: 'in',
        transferAmount: 100000,
        content: 'SK abc12345',
      },
      { auditPayload, rawBody: '{"id":42}' },
    );

    expect(result).toEqual({
      status: 'completed',
      orderId: 'order-1',
      planId: 'plan-1',
      userId: 'user-1',
    });
    expect(recordPaymentTransaction).toHaveBeenCalledWith(
      { payload: auditPayload, rawBody: '{"id":42}' },
      { skipOnConflict: true },
    );
    expect(processOrderCompletion).toHaveBeenCalledWith({
      sepayTransactionId: 42,
      transferAmount: 100000,
      orderCode: 'abc12345',
    });
  });
});
