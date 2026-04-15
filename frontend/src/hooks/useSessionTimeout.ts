'use client';

import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour in milliseconds
const SESSION_WARNING_TIME = 55 * 60 * 1000; // 5 minutes before timeout

export function useSessionTimeout() {
  const router = useRouter();
  let timeoutId: NodeJS.Timeout;
  let warningTimeoutId: NodeJS.Timeout;

  const resetTimeout = useCallback(() => {
    // Clear existing timeouts
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);

    // Set warning timeout (5 mins before logout)
    warningTimeoutId = setTimeout(() => {
      console.warn('Session expiring soon');
    }, SESSION_WARNING_TIME);

    // Set logout timeout
    timeoutId = setTimeout(() => {
      // Clear auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentData');
        localStorage.removeItem('adminToken');
      }

      // Show notification
      alert('Your session has expired. Please log in again.');

      // Redirect to login
      router.push('/login?session=expired');
    }, SESSION_TIMEOUT);
  }, [router]);

  const logout = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    if (warningTimeoutId) clearTimeout(warningTimeoutId);
  }, []);

  useEffect(() => {
    // Add event listeners for activity
    const events = ['mousedown', 'keydown', 'scroll', 'touchstart'];

    const resetOnActivity = () => {
      resetTimeout();
    };

    events.forEach((event) => {
      window.addEventListener(event, resetOnActivity);
    });

    resetTimeout();

    return () => {
      logout();
      events.forEach((event) => {
        window.removeEventListener(event, resetOnActivity);
      });
    };
  }, [resetTimeout, logout]);

  return { logout };
}
