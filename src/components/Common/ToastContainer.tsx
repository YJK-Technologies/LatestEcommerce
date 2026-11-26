import React from 'react';
import { useShop } from '../../context/ShopContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useShop();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let borderClass = 'border-emerald-500/20 bg-emerald-50 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-100';
        let iconColor = 'text-emerald-600 dark:text-emerald-400';

        if (toast.type === 'error') {
          Icon = AlertCircle;
          borderClass = 'border-rose-500/20 bg-rose-50 text-rose-900 dark:bg-rose-950/80 dark:text-rose-100';
          iconColor = 'text-rose-600 dark:text-rose-400';
        } else if (toast.type === 'info') {
          Icon = Info;
          borderClass = 'border-sky-500/20 bg-sky-50 text-sky-900 dark:bg-sky-950/80 dark:text-sky-100';
          iconColor = 'text-sky-600 dark:text-sky-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-md transition-all duration-300 animate-slide-up ${borderClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconColor}`} />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold">{toast.title}</div>
              <div className="text-xs opacity-90 line-clamp-2 mt-0.5">{toast.message}</div>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
