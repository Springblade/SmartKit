import { describe, it, expect, beforeEach } from 'vitest';
import { isEnabled } from '../lib/feature-flags';

describe('isEnabled', () => {
  beforeEach(() => {
    delete process.env.FLAG_NEW_BILLING_FLOW;
    delete process.env.FLAG_DARK_MODE;
  });

  it('returns default value when no env var is set', () => {
    expect(isEnabled('new_billing_flow', false)).toBe(false);
    expect(isEnabled('dark_mode', true)).toBe(true);
  });

  it('reads env var override when set to true', () => {
    process.env.FLAG_NEW_BILLING_FLOW = 'true';
    expect(isEnabled('new_billing_flow', false)).toBe(true);
  });

  it('reads env var override when set to false', () => {
    process.env.FLAG_NEW_BILLING_FLOW = 'false';
    expect(isEnabled('new_billing_flow', true)).toBe(false);
  });

  it('returns the same value on repeated calls within 5 minutes (cache hit)', () => {
    process.env.FLAG_NEW_BILLING_FLOW = 'true';
    const first = isEnabled('new_billing_flow', false);
    process.env.FLAG_NEW_BILLING_FLOW = 'false';
    const second = isEnabled('new_billing_flow', false);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });
});
