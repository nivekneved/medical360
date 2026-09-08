import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from 'lucide-react';
import '../components/common/Toast.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  title?: string;
  duration?: number;
}

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  title?: string;
}

interface ToastContextValue {
  toast: {
    success: (message: string, options?: ToastOptions) => void;
    error: (message: string, options?: ToastOptions) => void;
    warning: (message: string, options?: ToastOptions) => void;
    info: (message: string, options?: ToastOptions) => void;
  };
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((type: ToastType, message: string, options?: ToastOptions) => {
    const id = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const newToast: ToastMessage = {
      id,
      type,
      message,
      title: options?.title,
    };

    setToasts((prev) => [...prev, newToast]);

    const duration = options?.duration ?? 4000;
    if (duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    success: (msg: string, opts?: ToastOptions) => addToast('success', msg, opts),
    error: (msg: string, opts?: ToastOptions) => addToast('error', msg, opts),
    warning: (msg: string, opts?: ToastOptions) => addToast('warning', msg, opts),
    info: (msg: string, opts?: ToastOptions) => addToast('info', msg, opts),
  };

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 size={20} className="toast-icon" />;
      case 'error':
        return <AlertCircle size={20} className="toast-icon" />;
      case 'warning':
        return <AlertTriangle size={20} className="toast-icon" />;
      case 'info':
        return <Info size={20} className="toast-icon" />;
    }
  };

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="toast-container" role="region" aria-label="Notifications" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast-item toast-item--${t.type}`} role="alert">
            {getIcon(t.type)}
            <div className="toast-body">
              {t.title && <div className="toast-title">{t.title}</div>}
              <div className="toast-message">{t.message}</div>
            </div>
            <button
              className="toast-close"
              onClick={() => removeToast(t.id)}
              aria-label="Close notification"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context.toast;
}
