import { index, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const verification = pgTable(
  'verification',
  {
    id: text('id')
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    identifier: text('identifier').notNull(),
    value: text('value').notNull(),
    expiresAt: timestamp('expires_at').notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
    updatedAt: timestamp('updated_at').notNull().defaultNow(),
  },
  (table) => [
    index('verification_value_idx').on(table.value),
    index('verification_identifier_expires_idx').on(table.identifier, table.expiresAt),
  ],
);
