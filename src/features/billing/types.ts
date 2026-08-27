import { z } from 'zod';

// SePay API Response Types.
// `id` is nullable because SePay has been observed to send `id: null` on
// some webhook deliveries (tracked in CHANGELOG_AUDIT Increment 22). We
// accept the payload to capture the audit row, then bail out of business
// logic in the route handler — there is no key to dedupe on.
export const SepayWebhookPayloadSchema = z.object({
  id: z.number().nullable(),
  gateway: z.string(),
  transactionDate: z.string(),
  accountNumber: z.string(),
  content: z.string(),
  transferType: z.enum(['in', 'out']),
  transferAmount: z.number(),
  reference: z.string().optional().default(''),
  description: z.string().optional().default(''),
});

export type SepayWebhookPayload = z.infer<typeof SepayWebhookPayloadSchema>;

export const SepayTransactionSchema = SepayWebhookPayloadSchema.extend({
  orderCode: z.string().optional(),
  processedAt: z.date().optional(),
});

export type SepayTransaction = z.infer<typeof SepayTransactionSchema>;

// QR Generation Types
export const SepayQRParamsSchema = z.object({
  account: z.string().min(1),
  bank: z.string().min(1),
  amount: z.number().positive(),
  content: z.string().max(50),
});

export type SepayQRParams = z.infer<typeof SepayQRParamsSchema>;

// API Request/Response Types
export const SepayTransactionListParamsSchema = z.object({
  account_number: z.string().optional(),
  from_date: z.string().optional(),
  to_date: z.string().optional(),
  limit: z.number().int().positive().default(100),
  offset: z.number().int().nonnegative().default(0),
});

export type SepayTransactionListParams = z.input<typeof SepayTransactionListParamsSchema>;

export const SepayTransactionListResponseSchema = z.object({
  error: z.number().optional(),
  data: z.array(SepayWebhookPayloadSchema),
  total: z.number().optional(),
});

export type SepayTransactionListResponse = z.infer<typeof SepayTransactionListResponseSchema>;

// Domain Types
// Must stay in sync with `orderStatusEnum` in src/database/schema/enums.ts.
export const PaymentStatusSchema = z.enum(['pending', 'completed', 'expired', 'cancelled']);
export type PaymentStatus = z.infer<typeof PaymentStatusSchema>;

export const OrderCodePrefix = 'SK';
