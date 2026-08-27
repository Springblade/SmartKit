import { Resend } from 'resend';
import { env } from '@/lib/env';
import 'server-only';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export interface SendEmailOptions {
  to: string;
  subject: string;
  react: React.ReactElement;
}

export interface SendEmailResult {
  id: string | null;
  skipped: boolean;
}

export async function sendEmail({ to, subject, react }: SendEmailOptions): Promise<SendEmailResult> {
  if (!resend) {
    console.warn('[email] RESEND_API_KEY not set, skipping email send to:', to);
    return { id: null, skipped: true };
  }

  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL,
    to: [to],
    subject,
    react,
  });

  if (error) {
    console.error('[email] Resend error:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }

  return { id: data?.id ?? null, skipped: false };
}
