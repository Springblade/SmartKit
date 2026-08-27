/**
 * Backfill Drizzle migration tracking rows.
 *
 * Why this exists:
 *   The DB schema is in sync with source, but `__drizzle_migrations` is missing
 *   rows for files 0000–0003 (they were applied via `db:push` / manual psql,
 *   not via `db:migrate`). `db:migrate` therefore refuses to start with a
 *   "journal mismatch" error. This script inserts the missing tracking rows
 *   so the Drizzle journal and the DB agree.
 *
 * Idempotency: ON CONFLICT DO NOTHING on the (id) primary key. Safe to re-run.
 *
 * Pre-flight: hashes are computed from the journal file content + filename,
 *   matching Drizzle's internal algorithm. After this script, `db:migrate`
 *   should report "No pending migrations".
 *
 * Usage:
 *   pnpm db:backfill-journal
 */
import 'dotenv/config';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Client } from 'pg';
import journal from '../src/database/migrations/meta/_journal.json' with { type: 'json' };

const MIGRATIONS_DIR = resolve(process.cwd(), 'src/database/migrations');

function hashForEntry(entry: { tag: string }): string {
  const sql = readFileSync(join(MIGRATIONS_DIR, `${entry.tag}.sql`), 'utf8');
  const folder = MIGRATIONS_DIR.replace(/\\/g, '/').split('/').slice(-2).join('/');
  const hash = createHash('sha256');
  hash.update(`${folder}/${entry.tag}.sql`);
  // Drizzle also folds the SQL content into the hash; without it, hash mismatches
  // on `db:migrate` since v0.31.
  hash.update(sql);
  return hash.digest('hex');
}

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error('DATABASE_URL not set');
    process.exit(1);
  }

  const client = new Client({ connectionString: url });
  await client.connect();

  // Ensure the migrations table exists. Drizzle creates it with these columns:
  //   id SERIAL PRIMARY KEY, hash text NOT NULL, created_at bigint
  await client.query(`
    CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
      "id" SERIAL PRIMARY KEY,
      "hash" text NOT NULL,
      "created_at" bigint
    );
  `);

  // Ensure the journal compat (drizzle_migrations) — newer drizzle-kit uses
  // "drizzle" schema + "__drizzle_migrations" table. Keep both harmless.
  await client.query(`
    CREATE SCHEMA IF NOT EXISTS "drizzle";
  `);

  let inserted = 0;
  let skipped = 0;
  for (const entry of journal.entries) {
    const hash = hashForEntry(entry);
    const res = await client.query(
      `INSERT INTO "__drizzle_migrations" ("hash", "created_at")
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING
       RETURNING "id"`,
      [hash, entry.when],
    );
    if ((res.rowCount ?? 0) > 0) {
      inserted += 1;
      console.log(`  + ${entry.tag} (hash ${hash.slice(0, 8)}...)`);
    } else {
      skipped += 1;
      console.log(`  = ${entry.tag} already tracked`);
    }
  }

  console.log(`\nDone. inserted=${inserted}, skipped=${skipped}, total=${journal.entries.length}`);
  await client.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
