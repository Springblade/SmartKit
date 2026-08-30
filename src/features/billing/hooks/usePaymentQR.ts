'use client';

import { useEffect, useState } from 'react';
import { generatePaymentQRAction } from '../actions/generate-payment-qr';

interface UsePaymentQRResult {
  qrUrl: string | null;
  qrError: string | null;
  isGenerating: boolean;
}

const DEFAULT_ERROR = 'Could not generate QR code.';

export function usePaymentQR(orderCode: string, amountVnd: number): UsePaymentQRResult {
  const [qrUrl, setQrUrl] = useState<string | null>(null);
  const [qrError, setQrError] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function generateQR() {
      setIsGenerating(true);
      setQrError(null);

      const result = await generatePaymentQRAction(orderCode, amountVnd);

      if (cancelled) return;

      if (result.success && result.qrUrl) {
        setQrUrl(result.qrUrl);
      } else {
        setQrError(result.error ?? DEFAULT_ERROR);
      }

      setIsGenerating(false);
    }

    generateQR();

    return () => {
      cancelled = true;
    };
  }, [orderCode, amountVnd]);

  return { qrUrl, qrError, isGenerating };
}
