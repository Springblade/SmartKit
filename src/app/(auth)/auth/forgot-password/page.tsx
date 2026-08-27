'use client';

import Link from 'next/link';
import { useState } from 'react';
import { authClient } from '@/features/auth/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await authClient.requestPasswordReset({
      email,
      redirectTo: '/auth/reset-password',
    });

    if (result.error) {
      setError(result.error.message || 'Có lỗi xảy ra');
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
          <h1 className="text-2xl font-bold">Kiểm tra email</h1>
          <p className="text-gray-600">
            Chúng tôi đã gửi link reset mật khẩu tới <strong>{email}</strong>.
          </p>
          <p className="text-sm text-gray-500">Vui lòng kiểm tra hộp thư (kể cả spam). Link hết hạn sau 1 giờ.</p>
          <p className="text-center text-sm">
            <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
              Quay lại đăng nhập
            </Link>
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Quên mật khẩu</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {loading ? 'Đang xử lý...' : 'Gửi link reset'}
          </button>
        </form>

        <p className="text-center text-sm">
          Đã có tài khoản?{' '}
          <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
            Đăng nhập
          </Link>
        </p>
      </div>
    </main>
  );
}
