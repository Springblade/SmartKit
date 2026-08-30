import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold">SmartKit Boilerplate</h1>
      <p className="mt-4 text-lg text-gray-600">Next.js 16 + Better Auth + Drizzle + Tailwind</p>
      <div className="mt-8 flex gap-4">
        <Link href="/auth/sign-in" className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800">
          Sign In
        </Link>
        <Link href="/auth/sign-up" className="rounded-md border border-black px-4 py-2 hover:bg-gray-100">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
