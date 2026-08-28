import { render, screen, waitFor } from '@/tests/utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import userEvent from '@testing-library/user-event';

// Mock Next.js router and navigation
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
  useSearchParams: () => ({
    get: vi.fn((key: string) => {
      if (key === 'redirectTo') return '/dashboard';
      if (key === 'reset') return null;
      return null;
    }),
  }),
}));

// Mock auth client
const mockSignIn = vi.fn();
const mockSendVerificationEmail = vi.fn();

vi.mock('@/features/auth/client', () => ({
  signIn: {
    email: mockSignIn,
  },
  authClient: {
    sendVerificationEmail: mockSendVerificationEmail,
  },
}));

// Mock GoogleButton component
vi.mock('@/features/auth/components', () => ({
  GoogleButton: () => <div data-testid="google-button">Google Button Mock</div>,
}));

// Import the page component after mocks are set up
const SignInFormModule = await import('@/app/(auth)/auth/sign-in/page');
const SignInPage = SignInFormModule.default;

describe('Sign In Form', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password inputs', async () => {
    render(<SignInPage />);
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/mật khẩu/i)).toBeInTheDocument();
    });
  });

  it('shows error message on failed sign in', async () => {
    const user = userEvent.setup();
    
    mockSignIn.mockImplementation((credentials, options) => {
      options?.onError?.({
        error: {
          status: 401,
          message: 'Email hoặc mật khẩu không đúng',
        },
      });
      return Promise.resolve({ error: { message: 'Failed' } });
    });

    render(<SignInPage />);

    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    });

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/mật khẩu/i);
    const submitButton = screen.getByRole('button', { name: /đăng nhập/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'wrongpassword');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/email hoặc mật khẩu không đúng/i)).toBeInTheDocument();
    });
  });
});
