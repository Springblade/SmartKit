/**
 * Seed test data for local development.
 * Modified to avoid React.cache issue in Node environment.
 *
 * Idempotent — safe to run multiple times. Creates:
 *  - 1 admin user (admin@smartkit.local)
 *  - 1 normal user (user@smartkit.local)
 *  - 3 plans: Basic (99,000 VND), Pro (299,000 VND), Enterprise (999,000 VND)
 *
 * Prerequisites:
 *   - Postgres running (`docker compose up -d`)
 *   - `.env` configured (DATABASE_URL)
 *   - Run `pnpm db:push` first to create tables
 *
 * Usage:
 *   pnpm db:seed
 */
import 'dotenv/config';
import { hash } from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from '../src/database/db';
import { account, plans, user } from '../src/database/schema';

const SEED_USERS = [
  {
    email: 'admin@smartkit.local',
    name: 'Admin',
    password: 'Admin@123456',
    role: 'admin' as const,
  },
  {
    email: 'user@smartkit.local',
    name: 'Test User',
    password: 'User@123456',
    role: 'user' as const,
  },
];

const SEED_PLANS = [
  {
    id: 'plan-basic',
    name: 'Basic',
    priceVnd: '99000',
    features: ['3 Projects', 'Basic Analytics', 'Email Support'],
  },
  {
    id: 'plan-pro',
    name: 'Pro',
    priceVnd: '299000',
    features: ['5 Projects', 'Unlimited Projects', 'Advanced Analytics', 'Priority Support', 'API Access'],
  },
  {
    id: 'plan-enterprise',
    name: 'Enterprise',
    priceVnd: '999000',
    features: [
      'Unlimited Projects',
      'Unlimited Team Members',
      'Advanced Analytics',
      'Custom Integrations',
      'Dedicated Support',
      'SLA',
    ],
  },
];

async function seedPlans(): Promise<void> {
  let created = 0;
  for (const p of SEED_PLANS) {
    const existing = await db.select({ id: plans.id }).from(plans).where(eq(plans.id, p.id)).limit(1);
    if (existing.length > 0) continue;
    await db.insert(plans).values({ ...p, isActive: true });
    created++;
  }
  console.log(`✓ Plans: ${created} created, ${SEED_PLANS.length - created} already existed`);
}

async function seedUsers(): Promise<void> {
  for (const u of SEED_USERS) {
    const existing = await db.select({ id: user.id }).from(user).where(eq(user.email, u.email)).limit(1);
    if (existing.length > 0) {
      console.log(`  · user ${u.email} already exists, skipping`);
      continue;
    }
    const userId = crypto.randomUUID();
    const passwordHash = await hash(u.password, 12);

    await db.insert(user).values({
      id: userId,
      email: u.email,
      name: u.name,
      emailVerified: true,
      role: u.role,
    });
    await db.insert(account).values({
      id: crypto.randomUUID(),
      userId,
      providerId: 'credential',
      accountId: u.email,
      password: passwordHash,
    });
    console.log(`  ✓ created ${u.email} (role=${u.role})`);
  }
}

async function main(): Promise<void> {
  console.log('\nSeeding SmartKit dev data...\n');

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL not set. Check your .env file.');
    process.exit(1);
  }

  await seedPlans();
  await seedUsers();

  console.log('\nDone. Test accounts:');
  for (const u of SEED_USERS) {
    console.log(`  ${u.role.padEnd(5)} | ${u.email.padEnd(28)} | ${u.password}`);
  }
  console.log('');
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
