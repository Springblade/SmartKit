import { describe, it, expect, beforeEach } from 'vitest';
import { isEnabled } from '../flag';

describe('isEnabled (Run 10 Cond B seed 1234567903)', () => {
  beforeEach(() => {
    delete process.env.FLAG_DARK_MODE;
    delete process.env.FLAG_ANALYTICS_V2;
  });

  it('returns default when no env var is set', () => {
    expect(isEnabled('dark_mode', false)).toBe(false);
    expect(isEnabled('analytics_v2', true)).toBe(true);
  });

  it('honours env override true', () => {
    process.env.FLAG_DARK_MODE = 'true';
    expect(isEnabled('dark_mode', false)).toBe(true);
  });

  it('honours env override false', () => {
    process.env.FLAG_ANALYTICS_V2 = 'false';
    expect(isEnabled('analytics_v2', true)).toBe(false);
  });

  it('caches the first resolution and ignores later env changes within TTL', () => {
    process.env.FLAG_DARK_MODE = 'true';
    const first = isEnabled('dark_mode', false);
    process.env.FLAG_DARK_MODE = 'false';
    const second = isEnabled('dark_mode', false);
    expect(first).toBe(true);
    expect(second).toBe(true);
  });
});
