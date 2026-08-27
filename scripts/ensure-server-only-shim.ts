/**
 * Ensure a `server-only` no-op shim exists at `node_modules/server-only/`.
 *
 * Why: tsx scripts (e.g. test:billing) import modules that have
 * `import 'server-only'`. Next.js's real `server-only` throws outside a
 * server bundler. We install a tiny shim so the script can run.
 *
 * The shim source lives in `scripts/server-only-shim/`. This script
 * copies the two files into `node_modules/server-only/`. It is idempotent
 * — running it when the shim already exists is a no-op.
 *
 * Usage:
 *   pnpm tsx scripts/ensure-server-only-shim.ts
 *
 * Wired as `pretest` so it runs before any `pnpm test:*` script.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';

const SHIM_DIR = resolve(process.cwd(), 'scripts/server-only-shim');
const TARGET_DIR = resolve(process.cwd(), 'node_modules/server-only');

function main(): void {
  if (existsSync(join(TARGET_DIR, 'index.js')) && existsSync(join(TARGET_DIR, 'package.json'))) {
    return;
  }
  mkdirSync(TARGET_DIR, { recursive: true });
  copyFileSync(join(SHIM_DIR, 'index.js'), join(TARGET_DIR, 'index.js'));
  copyFileSync(join(SHIM_DIR, 'package.json'), join(TARGET_DIR, 'package.json'));
  console.log('Installed server-only shim at node_modules/server-only/');
}

main();
