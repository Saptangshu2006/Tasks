import React from 'react';
import TaskCard from './TaskCard';
import { Clock, PlayCircle, CheckCircle2, Plus } from 'lucide-react';

export default function KanbanView({
  tasks = [],
  onEdit,
  onDelete,
  onStatusChange,
  onOpenCreateModal,
}) {
  const columns = [
    {
      id: 'pending',
      title: 'Pending',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-500/10',
      badge: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'in_progress',
      title: 'In Progress',
      icon: PlayCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-500/10',
      badge: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'completed',
      title: 'Completed',
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-500/10',
      badge: 'bg-emerald-100 text-emerald-800',
    },
  ];

  const getTasksByStatus = (status) =>
    tasks.filter((t) => t.status === status);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
      {columns.map((col) => {
        const colTasks = getTasksByStatus(col.id);
        const Icon = col.icon;
        return (
          <div
            key={col.id}
            className="bg-slate-100/70 border border-slate-200/80 rounded-2xl p-4 flex flex-col min-h-[500px]"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-2">
                <div className={`p-1 rounded-lg ${col.bg} ${col.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-slate-800">{col.title}</h3>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-semibold ${col.badge}`}
                >
                  {colTasks.length}
                </span>
              </div>

              {col.id === 'pending' && (
                <button
                  onClick={onOpenCreateModal}
                  className="p-1 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white transition cursor-pointer"
                  title="Add task to pending"
                >
                  <Plus className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Task Cards Column Body */}
            <div className="flex-1 space-y-3">
              {colTasks.length === 0 ? (
                <div className="h-36 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center text-xs text-slate-400">
                  No {col.title.toLowerCase()} tasks
                </div>
              ) : (
                colTasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onStatusChange={onStatusChange}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
