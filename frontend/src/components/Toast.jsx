import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 3000 }) {
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [message, duration, onClose]);

  if (!message) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      icon: CheckCircle2,
      iconColor: 'text-emerald-500',
    },
    error: {
      bg: 'bg-rose-50 border-rose-200 text-rose-800',
      icon: AlertCircle,
      iconColor: 'text-rose-500',
    },
    info: {
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
      icon: Info,
      iconColor: 'text-indigo-500',
    },
  }[type] || {
    bg: 'bg-slate-800 text-white border-slate-700',
    icon: Info,
    iconColor: 'text-white',
  };

  const Icon = typeConfig.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm ${typeConfig.bg}`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 ${typeConfig.iconColor}`} />
        <span className="text-xs font-semibold">{message}</span>
        <button
          onClick={onClose}
          className="ml-auto p-0.5 rounded text-slate-400 hover:text-slate-700 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
