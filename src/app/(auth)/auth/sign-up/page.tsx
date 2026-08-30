'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signUp } from '@/features/auth/client';
import { GoogleButton } from '@/features/auth/components';

const STRINGS = {
  pageTitle: 'Sign Up',
  nameLabel: 'Full Name',
  emailLabel: 'Email',
  passwordLabel: 'Password (minimum 8 characters)',
  submitButton: 'Sign Up',
  submittingButton: 'Signing up...',
  hasAccount: 'Already have an account?',
  signIn: 'Sign In',
  errors: {
    failed: 'Sign up failed',
  },
  successTitle: 'Check your email',
  successBodyP1: 'We sent a verification email to',
  successBodyP2: 'Click the link in the email to verify your account.',
  successBodyP3: "If you don't receive the email, check your spam folder or wait 5 minutes and try again.",
  backToSignIn: 'Back to sign in',
} as const;

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await signUp.email({
      email,
      password,
      name,
    });

    if (error) {
      setError(error.message || STRINGS.errors.failed);
      setLoading(false);
      return;
    }

    setSubmitted(true);
    setLoading(false);
  }

  if (submitted) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <div className="w-full max-w-sm space-y-4">
          <h1 className="text-2xl font-bold">{STRINGS.successTitle}</h1>
          <p className="text-gray-600">
            {STRINGS.successBodyP1} <strong>{email}</strong>.
          </p>
          <p className="text-sm text-gray-500">{STRINGS.successBodyP2}</p>
          <p className="text-sm text-gray-400">{STRINGS.successBodyP3}</p>
          <p className="text-center text-sm">
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
              {STRINGS.backToSignIn}
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">{STRINGS.pageTitle}</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              {STRINGS.nameLabel}
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? STRINGS.submittingButton : STRINGS.submitButton}
          </button>
        </form>

        <hr className="my-6" />
        <GoogleButton mode="sign-up" />

        <p className="text-center text-sm">
          {STRINGS.hasAccount}{' '}
          <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
            {STRINGS.signIn}
          </Link>
        </p>
      </div>
    </main>
  );
}
