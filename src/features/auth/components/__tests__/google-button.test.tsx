import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { GoogleButton } from '../google-button';

// Mock Next.js modules
vi.mock('next/navigation', () => ({
  useSearchParams: () => ({
    get: vi.fn(() => null),
  }),
}));

vi.mock('@/features/auth/client', () => ({
  signIn: {
    social: vi.fn(),
  },
}));

describe('GoogleButton', () => {
  it('does not render when Google auth is disabled', () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_ENABLED;
    process.env.NEXT_PUBLIC_GOOGLE_ENABLED = 'false';

    const { container } = render(<GoogleButton mode="sign-in" />);

    expect(container.firstChild).toBeNull();

    process.env.NEXT_PUBLIC_GOOGLE_ENABLED = originalEnv;
  });

  it('renders sign-in button with correct text when enabled', () => {
    const originalEnv = process.env.NEXT_PUBLIC_GOOGLE_ENABLED;
    process.env.NEXT_PUBLIC_GOOGLE_ENABLED = 'true';

    render(<GoogleButton mode="sign-in" />);

    expect(screen.getByRole('button', { name: /đăng nhập với google/i })).toBeInTheDocument();

    process.env.NEXT_PUBLIC_GOOGLE_ENABLED = originalEnv;
  });
});
