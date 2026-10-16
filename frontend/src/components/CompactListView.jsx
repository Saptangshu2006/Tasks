import React from 'react';
import {
  Calendar,
  AlertCircle,
  Tag as TagIcon,
  CheckCircle2,
  Circle,
  Edit2,
  Trash2,
} from 'lucide-react';

export default function CompactListView({
  tasks = [],
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const formatDueDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const priorityStyles = {
    high: 'bg-rose-50 text-rose-700 border-rose-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  if (tasks.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4 w-10">Done</th>
              <th className="py-3 px-4">Title & Description</th>
              <th className="py-3 px-4 w-28">Status</th>
              <th className="py-3 px-4 w-24">Priority</th>
              <th className="py-3 px-4 w-32">Due Date</th>
              <th className="py-3 px-4">Tags</th>
              <th className="py-3 px-4 w-20 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tasks.map((task) => {
              const isOverdue =
                task.dueDate &&
                new Date(task.dueDate) < new Date() &&
                task.status !== 'completed';

              return (
                <tr
                  key={task._id}
                  className={`hover:bg-slate-50/80 transition-colors ${
                    task.status === 'completed' ? 'bg-slate-50/40 text-slate-400' : ''
                  }`}
                >
                  {/* Done checkbox */}
                  <td className="py-3 px-4">
                    <button
                      onClick={() =>
                        onStatusChange(
                          task._id,
                          task.status === 'completed' ? 'pending' : 'completed'
                        )
                      }
                      className="cursor-pointer text-slate-400 hover:text-emerald-600 transition"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>
                  </td>

                  {/* Title & Description */}
                  <td className="py-3 px-4">
                    <div
                      className={`font-semibold text-slate-800 ${
                        task.status === 'completed' ? 'line-through text-slate-400' : ''
                      }`}
                    >
                      {task.title}
                    </div>
                    {task.description && (
                      <div className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {task.description}
                      </div>
                    )}
                  </td>

                  {/* Status Dropdown */}
                  <td className="py-3 px-4">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task._id, e.target.value)}
                      className="text-[11px] font-medium px-2 py-0.5 rounded border border-slate-200 bg-white focus:outline-none cursor-pointer"
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>

                  {/* Priority Badge */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        priorityStyles[task.priority || 'medium']
                      }`}
                    >
                      {task.priority || 'medium'}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="py-3 px-4">
                    <span
                      className={`inline-flex items-center gap-1 font-medium ${
                        isOverdue ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      {isOverdue && <AlertCircle className="w-3 h-3 text-rose-500" />}
                      {formatDueDate(task.dueDate)}
                    </span>
                  </td>

                  {/* Tags */}
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {task.tags && task.tags.length > 0 ? (
                        task.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                          >
                            #{tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(task)}
                        className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition cursor-pointer"
                        title="Edit"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDelete(task)}
                        className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
