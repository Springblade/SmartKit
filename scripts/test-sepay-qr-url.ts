import 'dotenv/config';
import assert from 'node:assert/strict';
import { generatePaymentQR, generateSepayQRUrl, isSepayQRConfigured } from '../src/features/billing/sepay';

const qrUrl = new URL(
  generateSepayQRUrl({
    account: '0010000000355',
    bank: 'Vietcombank',
    amount: 100000,
    content: 'SK AB 12',
  }),
);

assert.equal(qrUrl.origin, 'https://qr.sepay.vn');
assert.equal(qrUrl.pathname, '/img');
assert.equal(qrUrl.searchParams.get('acc'), '0010000000355');
assert.equal(qrUrl.searchParams.get('bank'), 'Vietcombank');
assert.equal(qrUrl.searchParams.get('amount'), '100000');
assert.equal(qrUrl.searchParams.get('des'), 'SK AB 12');
assert.equal(qrUrl.search.includes('des=SK+AB+12'), true);
assert.equal(qrUrl.searchParams.has('account'), false);
assert.equal(qrUrl.searchParams.has('content'), false);

assert.equal(isSepayQRConfigured(), true, 'Configure SEPAY_BANK_ACCOUNT and SEPAY_BANK_NAME in .env');
const configuredQrUrl = new URL(generatePaymentQR('AB12', 100000));
assert.equal(configuredQrUrl.searchParams.get('amount'), '100000');
assert.equal(configuredQrUrl.searchParams.get('des'), 'SK AB12');
assert.equal(configuredQrUrl.searchParams.has('acc'), true);
assert.equal(configuredQrUrl.searchParams.has('bank'), true);

console.log('SePay QR URL generation passed.');
