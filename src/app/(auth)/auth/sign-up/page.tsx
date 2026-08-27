'use client';

import Link from 'next/link';
import { useState } from 'react';
import { signUp } from '@/features/auth/client';
import { GoogleButton } from '@/features/auth/components';

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
      setError(error.message || 'Đăng ký thất bại');
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
            Chúng tôi đã gửi email xác thực tới <strong>{email}</strong>.
          </p>
          <p className="text-sm text-gray-500">Vui lòng click link trong email để xác thực tài khoản.</p>
          <p className="text-sm text-gray-400">
            Nếu không nhận được email, vui lòng kiểm tra thư mục spam hoặc chờ 5 phút rồi thử lại.
          </p>
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
        <h1 className="text-2xl font-bold">Đăng ký</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Họ và tên
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
              Mật khẩu (tối thiểu 8 ký tự)
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
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>

        <hr className="my-6" />
        <GoogleButton mode="sign-up" />

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
