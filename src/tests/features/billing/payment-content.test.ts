import { describe, expect, it } from 'vitest';
import { extractOrderCode, generatePaymentContent } from '@/features/billing/payment-content';

describe('payment-content', () => {
  describe('extractOrderCode', () => {
    it('extracts order code from valid payment content', () => {
      expect(extractOrderCode('SK abc12345')).toBe('abc12345');
    });

    it('returns null when prefix is missing', () => {
      expect(extractOrderCode('abc12345')).toBeNull();
    });

    it('returns null when code is too short', () => {
      expect(extractOrderCode('SK abcd')).toBeNull();
    });
  });

  describe('generatePaymentContent', () => {
    it('embeds order code with SK prefix', () => {
      expect(generatePaymentContent('abc12345')).toBe('SK abc12345');
    });
  });
});
