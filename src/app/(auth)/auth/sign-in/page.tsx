'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { authClient, signIn } from '@/features/auth/client';
import { GoogleButton } from '@/features/auth/components';

const STRINGS = {
  pageTitle: 'Sign In',
  emailLabel: 'Email',
  passwordLabel: 'Password',
  submitButton: 'Sign In',
  submittingButton: 'Signing in...',
  forgotPassword: 'Forgot password?',
  noAccount: "Don't have an account?",
  signUp: 'Sign Up',
  resetSuccessTitle: 'Password Reset',
  resetSuccessBody: 'Your password has been reset. Sign in with your new password.',
  emailNotVerified: 'Email not verified? Click below to resend the verification link.',
  resendButtonSending: 'Sending...',
  resendButtonSent: 'Verification email sent',
  resendButtonDefault: 'Resend verification email',
  errors: {
    unverified: 'Your email has not been verified. Check your inbox and click the verification link.',
    failed: 'Sign in failed',
    resendFailed: 'Could not resend the email. Please try again later.',
  },
  loading: 'Loading...',
} as const;

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') || '/dashboard';
  const showResetSuccess = searchParams.get('reset') === 'success';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setLoading(true);

    const { error: signInError } = await signIn.email(
      { email, password },
      {
        onError: (ctx) => {
          if (ctx.error.status === 403) {
            setNeedsVerification(true);
            setError(STRINGS.errors.unverified);
          } else {
            setError(ctx.error.message || STRINGS.errors.failed);
          }
          setLoading(false);
        },
      },
    );

    if (!signInError) {
      router.push(redirectTo);
      router.refresh();
    }
  }

  async function handleResendVerification() {
    setResendStatus('sending');
    const { error: resendError } = await authClient.sendVerificationEmail({
      email,
      callbackURL: redirectTo,
    });
    if (resendError) {
      setResendStatus('error');
      setError(resendError.message || STRINGS.errors.resendFailed);
    } else {
      setResendStatus('sent');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {showResetSuccess && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">{STRINGS.resetSuccessBody}</div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            {STRINGS.emailLabel}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            {STRINGS.passwordLabel}
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        {needsVerification && (
          <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm">
            <p className="text-amber-800">{STRINGS.emailNotVerified}</p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendStatus === 'sending' || resendStatus === 'sent'}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {resendStatus === 'sending'
                ? STRINGS.resendButtonSending
                : resendStatus === 'sent'
                  ? STRINGS.resendButtonSent
                  : STRINGS.resendButtonDefault}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? STRINGS.submittingButton : STRINGS.submitButton}
        </button>
      </form>

      <hr className="my-6" />
      <GoogleButton mode="sign-in" />

      <p className="text-center text-sm">
        <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
          {STRINGS.forgotPassword}
        </Link>
      </p>

      <p className="text-center text-sm">
        {STRINGS.noAccount}{' '}
        <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
          {STRINGS.signUp}
        </Link>
      </p>
    </>
  );
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">{STRINGS.pageTitle}</h1>
        <Suspense
          fallback={
            <div role="status" aria-live="polite" className="text-center">
              {STRINGS.loading}
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
