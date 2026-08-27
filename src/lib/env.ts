import { z } from 'zod';

const EnvSchema = z
  .object({
    DATABASE_URL: z.url(),
    BETTER_AUTH_SECRET: z.string().min(32, 'Generate with: openssl rand -base64 32'),
    BETTER_AUTH_URL: z.url().default('http://localhost:3000'),
    NEXT_PUBLIC_APP_URL: z.url().default('http://localhost:3000'),
    // Public — read at build time, inlined into the client bundle. Required for
    // the Better Auth browser client to know the API base URL.
    NEXT_PUBLIC_BETTER_AUTH_URL: z.url().default('http://localhost:3000'),
    RESEND_API_KEY: z.string().min(1).optional(),
    RESEND_FROM_EMAIL: z.string().email().default('onboarding@resend.dev'),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    NEXT_PUBLIC_GOOGLE_ENABLED: z.enum(['true', 'false']).default('false'),
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    // SePay (Vietnamese VietQR Payment - optional in dev, required in prod)
    SEPAY_API_KEY: z.string().optional(),
    SEPAY_WEBHOOK_SECRET: z.string().optional(),
    SEPAY_BANK_ACCOUNT: z.string().optional(),
    SEPAY_BANK_NAME: z.string().optional(),
    // Vercel Cron auth. Vercel sends `Authorization: Bearer <CRON_SECRET>`
    // automatically when set. Required in production to prevent unauthorized cron triggers.
    CRON_SECRET: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.NODE_ENV !== 'production') return;

    const requiredInProd: Array<[string, unknown]> = [
      ['CRON_SECRET', data.CRON_SECRET],
      ['SEPAY_WEBHOOK_SECRET', data.SEPAY_WEBHOOK_SECRET],
    ];

    for (const [name, value] of requiredInProd) {
      if (!value) {
        ctx.addIssue({
          code: 'custom',
          path: [name],
          message: `${name} is required in production`,
        });
      }
    }
  });

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(z.prettifyError(parsed.error));
  throw new Error('Invalid environment variables');
}

export const env = parsed.data;
export type Env = z.infer<typeof EnvSchema>;
