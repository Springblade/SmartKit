'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { authClient } from '@/features/auth/client';

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!token) {
    return (
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-2xl font-bold">Link không hợp lệ</h1>
        <p className="text-gray-600">Link reset không hợp lệ hoặc đã hết hạn.</p>
        <p className="text-center text-sm">
          <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
            Yêu cầu link mới
          </Link>
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }

    setError(null);
    setLoading(true);

    const result = await authClient.resetPassword({
      newPassword: password,
      token: token ?? undefined,
    });

    if (result.error) {
      setError(result.error.message || 'Có lỗi xảy ra');
      setLoading(false);
      return;
    }

    router.push('/auth/sign-in?reset=success');
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <h1 className="text-2xl font-bold">Đặt lại mật khẩu</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium">
            Mật khẩu mới
          </label>
          <input
            id="password"
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            minLength={8}
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium">
            Xác nhận mật khẩu
          </label>
          <input
            id="confirmPassword"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
            minLength={8}
            required
          />
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-md bg-black px-4 py-2 text-white disabled:opacity-50"
        >
          {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
        </button>
      </form>

      <p className="text-center text-sm">
        <Link href="/auth/sign-in" className="text-blue-600 hover:underline">
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <Suspense fallback={<div className="text-center">Đang tải...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}
