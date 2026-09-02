'use client';

import { useSyncExternalStore, useCallback } from 'react';

// Subscribe Listener untuk Event Storage (cross-tab & same-tab)
function subscribe(callback: () => void) {
  window.addEventListener('storage', callback);
  window.addEventListener('local-storage', callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('local-storage', callback);
  };
}

export function useLocalStorage<T>(key: string, initialValue: T) {
  // Snapshot untuk Client: baca langsung dari localStorage
  const getSnapshot = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? item : JSON.stringify(initialValue);
    } catch {
      return JSON.stringify(initialValue);
    }
  };

  // Snapshot untuk Server: kembalikan nilai awal agar tidak terjadi hydration mismatch
  const getServerSnapshot = () => {
    return JSON.stringify(initialValue);
  };

  // Sinkronisasikan State menggunakan useSyncExternalStore bawaan React
  // untuk membaca data dari localStorage browser secara aman
  const storedValue = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const parsedValue = JSON.parse(storedValue) as T;

  // Fungsi setter untuk menyimpan setiap perubahan state ke localStorage
  // dan memicu update otomatis ke UI
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const current = (() => {
          try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
          } catch {
            return initialValue;
          }
        })();
        const nextValue =
          typeof value === 'function' ? (value as (val: T) => T)(current) : value;
        window.localStorage.setItem(key, JSON.stringify(nextValue));
        window.dispatchEvent(new Event('local-storage'));
      } catch (error) {
        console.error(`[useLocalStorage] Error setting key "${key}":`, error);
        window.dispatchEvent(new Event('local-storage'));
      }
    },
    [key, initialValue]
  );

  return [parsedValue, setValue] as const;
}
