import 'dotenv/config';
import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
const fromEmail = process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev';

console.log('[DEBUG] RESEND_API_KEY exists:', Boolean(apiKey));
console.log('[DEBUG] RESEND_API_KEY prefix:', apiKey?.slice(0, 8));
console.log('[DEBUG] RESEND_FROM_EMAIL:', fromEmail);

if (!apiKey) {
  console.error('[FAIL] RESEND_API_KEY not set');
  process.exit(1);
}

const resend = new Resend(apiKey);
const result = await resend.emails.send({
  from: fromEmail,
  to: ['delivered@resend.dev'],
  subject: 'SmartKit debug test',
  html: '<p>If you see this, Resend works. Timestamp: ' + new Date().toISOString() + '</p>',
});

console.log('[RESULT]', JSON.stringify(result, null, 2));

if (result.error) {
  console.error('[FAIL] Resend error:', result.error.message);
  process.exit(1);
}

console.log('[OK] Email sent, id:', result.data?.id);
