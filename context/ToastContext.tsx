'use client';

import React, { createContext, useState, useContext, useCallback } from 'react';
import Toast, { ToastProps, ToastType } from '@/components/Toast';

interface ToastMessage extends Omit<ToastProps, 'onClose'> {
  id: string;
  duration?: number;
}

export interface ToastContextType {
  addToast: (message: string, type?: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(undefined);

const MAX_TOASTS = 5;

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'info', duration: number = 4000) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    setToasts((prevToasts) => {
      const newToasts = [...prevToasts, { id, message, type, duration }];
      if (newToasts.length > MAX_TOASTS) {
        return newToasts.slice(-MAX_TOASTS);
      }
      return newToasts;
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div
        className="fixed top-4 right-4 z-[9999] pointer-events-none"
        style={{ maxWidth: 'calc(100vw - 2rem)' }}
      >
        <div className="flex flex-col items-end space-y-2 pointer-events-auto">
          {toasts.map((toast) => (
            <Toast key={toast.id} {...toast} onClose={removeToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};
