import { describe, expect, it } from 'vitest';
import { render, screen } from '@/tests/utils';
import { PlanCard } from '../PlanCard';

const mockPlan = {
  id: 'plan-basic',
  name: 'Basic Plan',
  priceVnd: '100000',
  features: ['Feature 1', 'Feature 2', 'Feature 3'],
  stripePriceId: null,
  stripeProductId: null,
  durationDays: 30,
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('PlanCard', () => {
  it('renders plan information correctly', () => {
    render(<PlanCard plan={mockPlan} />);

    expect(screen.getByText('Basic Plan')).toBeInTheDocument();
    expect(screen.getByText('100.000')).toBeInTheDocument();
    expect(screen.getByText('VND')).toBeInTheDocument();
    expect(screen.getByText('Feature 1')).toBeInTheDocument();
    expect(screen.getByText('Feature 2')).toBeInTheDocument();
    expect(screen.getByText('Feature 3')).toBeInTheDocument();
  });

  it('shows current plan badge when isCurrentPlan is true', () => {
    render(<PlanCard plan={mockPlan} isCurrentPlan={true} />);

    expect(screen.getAllByText('Current Plan')).toHaveLength(2);

    const button = screen.getByRole('link', { name: /current plan/i });
    expect(button).toHaveAttribute('aria-disabled', 'true');
  });

  it('shows popular badge when isPopular is true', () => {
    render(<PlanCard plan={mockPlan} isPopular={true} />);

    expect(screen.getByText('Popular')).toBeInTheDocument();
  });

  it('renders select plan button when not current plan', () => {
    render(<PlanCard plan={mockPlan} />);

    const button = screen.getByRole('link', { name: /select plan/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', '/dashboard/billing?plan=plan-basic');
  });
});
