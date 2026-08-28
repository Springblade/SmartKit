import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@/tests/utils';
import { PaymentSection } from '../PaymentSection';

// Mock Next.js router
const mockPush = vi.fn();
const mockRefresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    refresh: mockRefresh,
  }),
}));

// Mock the payment polling hook
vi.mock('../../hooks/usePaymentPolling', () => ({
  usePaymentPolling: () => ({
    orderStatus: null,
    isLoading: false,
    error: null,
    refetch: vi.fn(),
  }),
}));

// Mock actions
vi.mock('../../actions/generate-payment-qr', () => ({
  generatePaymentQRAction: vi.fn(() =>
    Promise.resolve({
      success: true,
      qrUrl: 'https://example.com/qr.png',
    }),
  ),
}));

vi.mock('../../actions/cancel-order', () => ({
  cancelOrder: vi.fn(() => Promise.resolve()),
}));

const mockOrder = {
  id: 'order-123',
  code: 'ORD123',
  content: 'Payment for Basic Plan',
  amountVnd: 100000,
  expiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes from now
};

const mockPlan = {
  id: 'plan-basic',
  name: 'Basic Plan',
  priceVnd: 100000,
};

describe('PaymentSection', () => {
  it('renders payment details correctly', async () => {
    render(<PaymentSection order={mockOrder} plan={mockPlan} />);

    expect(screen.getByText('Thông tin thanh toán')).toBeInTheDocument();
    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === '100.000 VND';
      }),
    ).toBeInTheDocument();
    expect(screen.getByText('Payment for Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('ORD123')).toBeInTheDocument();
  });

  it('displays QR code loading state initially', () => {
    render(<PaymentSection order={mockOrder} plan={mockPlan} />);

    // Should show loading spinner for QR code
    expect(screen.getByLabelText('Đang tạo mã QR')).toBeInTheDocument();
  });
});
