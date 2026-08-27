/**
 * SePay API Test Script
 *
 * Usage:
 *   pnpm tsx scripts/test-sepay.ts
 *
 * Prerequisites:
 *   1. Register at https://my.sepay.vn
 *   2. Copy API Key from API section
 *   3. Update .env with SEPAY_API_KEY
 */

import { listSepayTransactions } from '../src/features/billing/sepay-api';
import { env } from '../src/lib/env';

async function main() {
  console.log('Testing SePay API connectivity...\n');

  if (!env.SEPAY_API_KEY) {
    console.error('ERROR: SEPAY_API_KEY is not set in .env');
    console.log('\nTo fix:');
    console.log('1. Register at https://my.sepay.vn');
    console.log('2. Go to API section and copy your API Key');
    console.log('3. Add it to .env: SEPAY_API_KEY="Bearer your-key-here"');
    process.exit(1);
  }

  console.log('API Key:', `${env.SEPAY_API_KEY.slice(0, 20)}...\n`);

  try {
    console.log('Fetching transactions...');
    const response = await listSepayTransactions({
      limit: 5,
    });

    console.log('\nResponse:');
    console.log(JSON.stringify(response, null, 2));

    if (response.data && response.data.length > 0) {
      console.log(`\nFound ${response.data.length} transaction(s)`);
    } else {
      console.log('\nNo transactions found (this is normal for new accounts)');
    }

    console.log('\nSePay API is working correctly!');
  } catch (error) {
    console.error('\nERROR:', error);

    if (error instanceof Error) {
      if (error.message.includes('401')) {
        console.log('\nAuthentication failed. Check your SEPAY_API_KEY');
      } else if (error.message.includes('fetch')) {
        console.log('\nNetwork error. Check your internet connection');
      }
    }

    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error);
  process.exit(1);
});
