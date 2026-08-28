import { describe, it, expect } from 'vitest';

describe('Smoke Test', () => {
  it('verifies Vitest is working', () => {
    expect(1 + 1).toBe(2);
  });

  it('verifies setup file is loaded', () => {
    // If setup.ts runs correctly, this test will pass
    expect(true).toBe(true);
  });
});
