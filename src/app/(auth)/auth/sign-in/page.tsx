'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { authClient, signIn } from '@/features/auth/client';
import { GoogleButton } from '@/features/auth/components';

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
            setError('Email chưa được xác minh. Vui lòng kiểm tra hộp thư và bấm vào link xác minh.');
          } else {
            setError(ctx.error.message || 'Đăng nhập thất bại');
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
      setError(resendError.message || 'Không gửi lại được email. Vui lòng thử lại sau.');
    } else {
      setResendStatus('sent');
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {showResetSuccess && (
          <div className="rounded-md bg-green-50 p-3 text-sm text-green-700">
            Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium">
            Email
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
            Mật khẩu
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
            <p className="text-amber-800">
              Email chưa xác minh? Hãy bấm nút bên dưới để chúng tôi gửi lại link xác minh.
            </p>
            <button
              type="button"
              onClick={handleResendVerification}
              disabled={resendStatus === 'sending' || resendStatus === 'sent'}
              className="rounded-md bg-amber-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-amber-700 disabled:opacity-50"
            >
              {resendStatus === 'sending'
                ? 'Đang gửi...'
                : resendStatus === 'sent'
                  ? 'Đã gửi lại email xác minh'
                  : 'Gửi lại email xác minh'}
            </button>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
      </form>

      <hr className="my-6" />
      <GoogleButton mode="sign-in" />

      <p className="text-center text-sm">
        <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
          Quên mật khẩu?
        </Link>
      </p>

      <p className="text-center text-sm">
        Chưa có tài khoản?{' '}
        <Link href="/auth/sign-up" className="text-blue-600 hover:underline">
          Đăng ký
        </Link>
      </p>
    </>
  );
}

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Đăng nhập</h1>
        <Suspense
          fallback={
            <div role="status" aria-live="polite" className="text-center">
              Đang tải...
            </div>
          }
        >
          <SignInForm />
        </Suspense>
      </div>
    </main>
  );
}
