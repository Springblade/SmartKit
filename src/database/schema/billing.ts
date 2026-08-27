// ============================================================
// Phase 2 — Billing
// ============================================================
// Tables for one-time lifetime payment model.
// No `user_credits` table — entitlement is derived from
// `orders` with `status = 'completed'`.

import { sql } from 'drizzle-orm';
import { boolean, index, numeric, pgTable, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { nanoid } from 'nanoid';
import { orderStatusEnum } from './enums';
import { user } from './user';

// 15 minutes — short expiry for unattended QR flow.
const ORDER_EXPIRY_MS = 15 * 60 * 1000;

// Plan catalog. One-time lifetime access; admin defines rows
// via Drizzle Studio or SQL (no UI for now).
export const plans = pgTable('plans', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  priceVnd: numeric('price_vnd', { precision: 12, scale: 0 }).notNull(),
  isActive: boolean('is_active').notNull().default(true),
  features: text('features').array().notNull().default(sql`'{}'::text[]`),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Orders awaiting or having completed payment.
// `code` is the user-facing nanoid(8) embedded in QR content
// (see `extractOrderCode` in features/billing/process-transaction.ts).
// `id` is internal UUID — keep `code` out of joins and logging.
export const orders = pgTable(
  'orders',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    code: text('code')
      .notNull()
      .$defaultFn(() => nanoid(8)),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
      .notNull()
      .references(() => plans.id),
    amountVnd: numeric('amount_vnd', { precision: 12, scale: 0 }).notNull(),
    status: orderStatusEnum('status').notNull().default('pending'),
    expiresAt: timestamp('expires_at')
      .notNull()
      .$defaultFn(() => new Date(Date.now() + ORDER_EXPIRY_MS)),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    completedAt: timestamp('completed_at'),
  },
  (table) => [
    index('orders_user_id_idx').on(table.userId),
    // Supports cron query in Block 14:
    //   WHERE status = 'pending' AND expires_at < now()
    index('orders_status_expires_idx').on(table.status, table.expiresAt),
    // `code` is the user-facing nanoid(8) embedded in QR content
    // and must be globally unique.
    uniqueIndex('orders_code_idx').on(table.code),
    // Prevents a single user from opening multiple concurrent `pending`
    // orders for the same plan (TOCTOU race in createOrder). Cancelled /
    // expired / completed orders do not occupy the slot.
    uniqueIndex('orders_user_plan_pending_idx').on(table.userId, table.planId).where(sql`${table.status} = 'pending'`),
  ],
);

// Audit log of every webhook/polling hit, including rejected
// payloads (no matching order). `sepay_transaction_id` is
// unique but nullable — rejects won't have an order link.
export const paymentTransactions = pgTable(
  'payment_transactions',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    orderId: text('order_id').references(() => orders.id, { onDelete: 'set null' }),
    sepayTransactionId: text('sepay_transaction_id'),
    amountVnd: numeric('amount_vnd', { precision: 12, scale: 0 }).notNull(),
    content: text('content').notNull(),
    rawPayload: text('raw_payload').notNull(),
    processedAt: timestamp('processed_at').notNull().defaultNow(),
  },
  (table) => [uniqueIndex('payment_tx_sepay_id_idx').on(table.sepayTransactionId)],
);
