'use client';

import { useEffect, useState } from 'react';

export function useOrderTimer(expiresAt: string): { timeLeft: string; isExpired: boolean } {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    function calculateTimeLeft() {
      const expiry = new Date(expiresAt);
      const now = new Date();
      const diff = expiry.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft('0:00');
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  return { timeLeft, isExpired: timeLeft === '0:00' };
}
