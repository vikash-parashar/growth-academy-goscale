'use client';

import { useState, useEffect } from 'react';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: NotificationType;
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type, duration = 3000, onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const bgColor = {
    success: 'bg-green-500/90 dark:bg-green-600/90',
    error: 'bg-red-500/90 dark:bg-red-600/90',
    info: 'bg-blue-500/90 dark:bg-blue-600/90',
    warning: 'bg-yellow-500/90 dark:bg-yellow-600/90',
  }[type];

  const icon = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
  }[type];

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-lg ${bgColor} px-4 py-3 text-white shadow-lg animate-in fade-in slide-in-from-top-2 duration-300`}
    >
      <span className="text-lg font-bold">{icon}</span>
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

export function useNotification() {
  const [notification, setNotification] = useState<ToastProps | null>(null);

  const showNotification = (message: string, type: NotificationType, duration = 3000) => {
    setNotification({ message, type, duration });
  };

  const showSuccess = (message: string, duration?: number) => {
    showNotification(message, 'success', duration);
  };

  const showError = (message: string, duration?: number) => {
    showNotification(message, 'error', duration);
  };

  const showInfo = (message: string, duration?: number) => {
    showNotification(message, 'info', duration);
  };

  const showWarning = (message: string, duration?: number) => {
    showNotification(message, 'warning', duration);
  };

  return {
    notification,
    setNotification,
    showNotification,
    showSuccess,
    showError,
    showInfo,
    showWarning,
  };
}
