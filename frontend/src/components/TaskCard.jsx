import React from 'react';
import {
  Calendar,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  Tag as TagIcon,
  CheckCircle2,
  Circle,
  ArrowRight
} from 'lucide-react';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== 'completed';

  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const diffDays = Math.round((targetDate - today) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined,
    });
  };

  const priorityStyles = {
    high: {
      bg: 'bg-rose-50 text-rose-700 border-rose-200',
      dot: 'bg-rose-500',
      label: 'High Priority',
    },
    medium: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      dot: 'bg-amber-500',
      label: 'Medium Priority',
    },
    low: {
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      dot: 'bg-slate-400',
      label: 'Low Priority',
    },
  }[task.priority || 'medium'];

  const statusStyles = {
    pending: {
      bg: 'bg-amber-50 text-amber-700 border-amber-200',
      label: 'Pending',
    },
    in_progress: {
      bg: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'In Progress',
    },
    completed: {
      bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      label: 'Completed',
    },
  }[task.status || 'pending'];

  return (
    <div
      className={`group relative bg-white rounded-xl border p-5 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between ${
        task.status === 'completed'
          ? 'border-slate-200/60 bg-slate-50/50 opacity-90'
          : isOverdue
          ? 'border-rose-200 ring-1 ring-rose-300/40'
          : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div>
        {/* Badges Bar: Priority & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${priorityStyles.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${priorityStyles.dot}`} />
              {task.priority ? task.priority.toUpperCase() : 'MEDIUM'}
            </span>

            {/* Quick Status Dropdown */}
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className={`text-xs font-medium px-2 py-0.5 rounded-md border focus:outline-none cursor-pointer transition ${statusStyles.bg}`}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Quick complete toggle */}
          <button
            onClick={() =>
              onStatusChange(
                task._id,
                task.status === 'completed' ? 'pending' : 'completed'
              )
            }
            title={task.status === 'completed' ? 'Mark as Pending' : 'Mark as Completed'}
            className="text-slate-400 hover:text-emerald-600 transition cursor-pointer p-0.5"
          >
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            ) : (
              <Circle className="w-5 h-5 text-slate-300 group-hover:text-slate-400" />
            )}
          </button>
        </div>

        {/* Task Title */}
        <h3
          className={`font-semibold text-base mb-1.5 text-slate-800 break-words ${
            task.status === 'completed' ? 'line-through text-slate-400' : ''
          }`}
        >
          {task.title}
        </h3>

        {/* Task Description */}
        {task.description && (
          <p
            className={`text-xs text-slate-500 mb-4 line-clamp-3 break-words ${
              task.status === 'completed' ? 'line-through text-slate-400' : ''
            }`}
          >
            {task.description}
          </p>
        )}
      </div>

      <div>
        {/* Tags */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3.5">
            {task.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600"
              >
                <TagIcon className="w-2.5 h-2.5 text-slate-400" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Details & Actions Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          {/* Due date info */}
          {task.dueDate ? (
            <div
              className={`inline-flex items-center gap-1.5 ${
                isOverdue
                  ? 'text-rose-600 font-semibold'
                  : 'text-slate-500'
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
              ) : (
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              )}
              <span>{formatDueDate(task.dueDate)}</span>
              {isOverdue && <span className="text-[10px] uppercase">(Overdue)</span>}
            </div>
          ) : (
            <span className="text-slate-400 text-[11px]">No due date</span>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(task)}
              title="Edit Task"
              className="p-1.5 rounded-md text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(task)}
              title="Delete Task"
              className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
