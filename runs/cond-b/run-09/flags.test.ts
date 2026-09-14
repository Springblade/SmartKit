import { describe, it, expect, beforeEach } from 'vitest';
import { isEnabled } from '../flags';

describe('isEnabled (Run 9 Cond B seed 1234567902)', () => {
  beforeEach(() => {
    delete process.env.FLAG_BETA_DASHBOARD;
    delete process.env.FLAG_NEW_CHECKOUT;
  });

  it('returns fallback when no env var is set', () => {
    expect(isEnabled('beta_dashboard', false)).toBe(false);
    expect(isEnabled('new_checkout', true)).toBe(true);
  });

  it('reads env override when set to true', () => {
    process.env.FLAG_BETA_DASHBOARD = 'true';
    expect(isEnabled('beta_dashboard', false)).toBe(true);
  });

  it('reads env override when set to false (overrides true fallback)', () => {
    process.env.FLAG_BETA_DASHBOARD = 'false';
    expect(isEnabled('beta_dashboard', true)).toBe(false);
  });

  it('returns the cached value on repeated calls within 5 minutes (cache hit)', () => {
    process.env.FLAG_NEW_CHECKOUT = 'true';
    const first = isEnabled('new_checkout', false);
    process.env.FLAG_NEW_CHECKOUT = 'false';
    const second = isEnabled('new_checkout', false);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });
});
