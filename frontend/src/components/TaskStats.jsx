import React from 'react';
import { CheckCircle2, Clock, PlayCircle, AlertTriangle, ListTodo, Flame } from 'lucide-react';

export default function TaskStats({ stats, activeStatus, onSelectStatus, activeDueFilter, onSelectDueFilter }) {
  if (!stats) return null;

  const statItems = [
    {
      id: 'all',
      label: 'Total Tasks',
      value: stats.total || 0,
      icon: ListTodo,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50/70',
      border: 'border-indigo-100',
      activeBorder: 'border-indigo-600 ring-2 ring-indigo-500/20',
      isActive: activeStatus === 'all' && activeDueFilter === 'all',
      onClick: () => {
        onSelectStatus('all');
        onSelectDueFilter('all');
      },
    },
    {
      id: 'pending',
      label: 'Pending',
      value: stats.pending || 0,
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50/70',
      border: 'border-amber-100',
      activeBorder: 'border-amber-500 ring-2 ring-amber-500/20',
      isActive: activeStatus === 'pending',
      onClick: () => {
        onSelectStatus(activeStatus === 'pending' ? 'all' : 'pending');
        onSelectDueFilter('all');
      },
    },
    {
      id: 'in_progress',
      label: 'In Progress',
      value: stats.inProgress || 0,
      icon: PlayCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50/70',
      border: 'border-blue-100',
      activeBorder: 'border-blue-500 ring-2 ring-blue-500/20',
      isActive: activeStatus === 'in_progress',
      onClick: () => {
        onSelectStatus(activeStatus === 'in_progress' ? 'all' : 'in_progress');
        onSelectDueFilter('all');
      },
    },
    {
      id: 'completed',
      label: 'Completed',
      value: stats.completed || 0,
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50/70',
      border: 'border-emerald-100',
      activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20',
      isActive: activeStatus === 'completed',
      onClick: () => {
        onSelectStatus(activeStatus === 'completed' ? 'all' : 'completed');
        onSelectDueFilter('all');
      },
    },
    {
      id: 'overdue',
      label: 'Overdue',
      value: stats.overdue || 0,
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50/70',
      border: 'border-rose-100',
      activeBorder: 'border-rose-500 ring-2 ring-rose-500/20',
      isActive: activeDueFilter === 'overdue',
      onClick: () => {
        onSelectDueFilter(activeDueFilter === 'overdue' ? 'all' : 'overdue');
      },
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 mb-6">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            type="button"
            onClick={item.onClick}
            className={`p-4 rounded-xl bg-white border text-left transition-all duration-150 cursor-pointer shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
              item.isActive ? item.activeBorder : 'border-slate-200/80 hover:border-slate-300'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-500">{item.label}</span>
              <div className={`p-1.5 rounded-lg ${item.bg} ${item.color}`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold text-slate-800">{item.value}</span>
              {item.id === 'overdue' && item.value > 0 && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                  Action req.
                </span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
