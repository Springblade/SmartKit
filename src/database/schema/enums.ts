import { pgEnum } from 'drizzle-orm/pg-core';

export const providerEnum = pgEnum('provider', ['credential', 'google']);
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);
export const orderStatusEnum = pgEnum('order_status', ['pending', 'completed', 'expired', 'cancelled']);
