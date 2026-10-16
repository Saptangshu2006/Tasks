import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  taskTitle,
  loading,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-4 border border-rose-100">
          <Trash2 className="w-6 h-6" />
        </div>

        <h3 className="text-base font-bold text-slate-900 text-center mb-1">
          Delete Task?
        </h3>
        <p className="text-xs text-slate-500 text-center mb-6">
          Are you sure you want to permanently delete{' '}
          <span className="font-semibold text-slate-700">"{taskTitle}"</span>?
          This action cannot be undone.
        </p>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-95 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
          >
            {loading ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  );
}
