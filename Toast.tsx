/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { Toast as ToastType } from './types';
import { useAppHelper } from './AppContext';

interface ToastProps {
  toast: ToastType;
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-[#0F766E]" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#F0FDF4] border-[#DCFCE7] text-[#14532D] shadow-[#22C55E]/10';
      case 'error':
        return 'bg-red-50 border-red-100 text-red-900 shadow-red-500/10';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-100 text-blue-900 shadow-blue-500/10';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg max-w-sm w-full animate-in slide-in-from-top-4 duration-300 md:animate-in md:slide-in-from-right-4 ${getStyles()}`}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium pr-2">
        {toast.message}
      </div>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 p-1 text-slate-400 hover:text-slate-600 rounded-lg transition-colors cursor-pointer"
        aria-label="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

interface ToastContainerProps {
  toasts?: ToastType[];
  onClose?: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onClose }) => {
  const context = useAppHelper();
  
  const activeToasts = toasts || context?.toasts || [];
  const handleClose = onClose || context?.removeToast || (() => {});

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-sm w-full font-sans">
      {activeToasts.map(toast => (
        <Toast key={toast.id} toast={toast} onClose={handleClose} />
      ))}
    </div>
  );
};
