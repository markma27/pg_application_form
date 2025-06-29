import { useState, useEffect } from 'react';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

export function useAutoLogout(router: AppRouterInstance) {
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const resetInactivityTimer = () => {
      setLastActivity(Date.now());
    };

    const checkInactivity = () => {
      const currentTime = Date.now();
      const inactiveTime = currentTime - lastActivity;
      const fifteenMinutes = 15 * 60 * 1000;

      if (inactiveTime >= fifteenMinutes && typeof window !== 'undefined') {
        localStorage.removeItem('accounting_token');
        localStorage.removeItem('accounting_user');
        router.push('/accounting/login');
      }
    };

    const activityInterval = setInterval(checkInactivity, 60 * 1000);

    const activityEvents = [
      'mousedown',
      'mousemove',
      'keydown',
      'scroll',
      'touchstart',
      'click',
      'keypress'
    ];

    activityEvents.forEach(eventName => {
      document.addEventListener(eventName, resetInactivityTimer);
    });

    return () => {
      clearInterval(activityInterval);
      activityEvents.forEach(eventName => {
        document.removeEventListener(eventName, resetInactivityTimer);
      });
    };
  }, [lastActivity, router]);
} 