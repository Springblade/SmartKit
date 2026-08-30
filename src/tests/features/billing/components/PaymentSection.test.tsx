import { render, screen } from '@/tests/utils';
import { describe, expect, it, vi } from 'vitest';
import { PaymentSection } from '@/features/billing/components/PaymentSection';

const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

vi.mock('@/features/billing/hooks/usePaymentPolling', () => ({
  usePaymentPolling: () => ({
    orderStatus: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

vi.mock('@/features/billing/hooks/usePaymentQR', () => ({
  usePaymentQR: () => ({
    qrUrl: null,
    qrError: null,
    isGenerating: true,
  }),
}));

vi.mock('@/features/billing/hooks/useOrderTimer', () => ({
  useOrderTimer: () => ({
    timeLeft: '14:59',
    isExpired: false,
  }),
}));

vi.mock('@/features/billing/actions/cancel-order', () => ({
  cancelOrder: vi.fn(() => Promise.resolve()),
}));

const mockOrder = {
  id: 'order-123',
  code: 'ORD123',
  content: 'Payment for Basic Plan',
  amountVnd: 100000,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
};

const mockPlan = {
  id: 'plan-basic',
  name: 'Basic Plan',
  priceVnd: 100000,
};

describe('PaymentSection', () => {
  it('renders payment details correctly', () => {
    render(<PaymentSection order={mockOrder} plan={mockPlan} />);

    expect(screen.getByText('Payment Information')).toBeInTheDocument();
    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('100.000 VND')).toBeInTheDocument();
    expect(screen.getByText('Payment for Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('ORD123')).toBeInTheDocument();
  });

  it('displays QR code loading state initially', () => {
    render(<PaymentSection order={mockOrder} plan={mockPlan} />);

    expect(screen.getByLabelText('Generating QR code...')).toBeInTheDocument();
  });
});
