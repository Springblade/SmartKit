'use client';

import { useRouter } from 'next/navigation';
import { signOut } from '@/features/auth/client';

export function SignOutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await signOut();
        router.push('/auth/sign-in');
      }}
      className="mt-2 text-xs text-muted-foreground hover:text-foreground"
    >
      Sign out
    </button>
  );
}
