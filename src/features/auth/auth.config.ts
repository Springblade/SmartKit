import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import type { BetterAuthOptions } from 'better-auth';
import { nextCookies } from 'better-auth/next-js';
import { admin } from 'better-auth/plugins';
import { db } from '@/database/db';
import * as schema from '@/database/schema';
import 'server-only';
import { ResetPasswordEmail, VerificationEmail, WelcomeEmail } from '@/features/auth/emails';
import { sendEmail } from '@/features/auth/lib/email';
import { env } from '@/lib/env';

export const authConfig: BetterAuthOptions = {
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your SmartKit password',
        react: ResetPasswordEmail({ name: user.name ?? user.email, resetUrl: url }),
      }).catch((err) => {
        console.warn('[auth] Reset password email failed:', err);
      });
    },
  },

  emailVerification: {
    sendOnSignUp: true,
    sendOnSignIn: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your SmartKit email',
        react: VerificationEmail({ name: user.name ?? user.email, verificationUrl: url }),
      }).catch((err) => {
        console.warn('[auth] Verification email failed:', err);
      });
    },
    afterEmailVerification: async (user) => {
      void sendEmail({
        to: user.email,
        subject: 'Welcome to SmartKit',
        react: WelcomeEmail({ name: user.name ?? user.email }),
      }).catch((err) => {
        console.warn('[auth] Welcome email failed:', err);
      });
    },
  },

  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },

  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google'],
      requireLocalEmailVerified: false, // OAuth users verified by Google, no need to verify before link
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // refresh after 1 day
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes
    },
  },

  plugins: [nextCookies(), admin()],
};
