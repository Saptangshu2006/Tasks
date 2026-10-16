import React, { useState, useEffect } from 'react';
import { X, Calendar, Tag, AlertCircle, Check } from 'lucide-react';

export default function TaskFormModal({ isOpen, onClose, onSave, taskToEdit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title || '');
      setDescription(taskToEdit.description || '');
      setStatus(taskToEdit.status || 'pending');
      setPriority(taskToEdit.priority || 'medium');
      setDueDate(
        taskToEdit.dueDate ? new Date(taskToEdit.dueDate).toISOString().split('T')[0] : ''
      );
      setTagsInput(taskToEdit.tags ? taskToEdit.tags.join(', ') : '');
    } else {
      setTitle('');
      setDescription('');
      setStatus('pending');
      setPriority('medium');
      setDueDate('');
      setTagsInput('');
    }
    setError('');
  }, [taskToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task title is required');
      return;
    }

    setSubmitting(true);
    setError('');

    const formattedTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const taskPayload = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      tags: formattedTags,
    };

    try {
      await onSave(taskPayload);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to save task.');
    } finally {
      setSubmitting(false);
    }
  };

  const setPresetDate = (daysFromNow) => {
    const d = new Date();
    d.setDate(d.getDate() + daysFromNow);
    setDueDate(d.toISOString().split('T')[0]);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-800">
            {taskToEdit ? 'Edit Task' : 'Create New Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Task Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Implement user authentication tests"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Add extra context, checklist, or acceptance criteria..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition resize-none"
            />
          </div>

          {/* Priority Selection Pills */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Priority
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'low', label: 'Low', color: 'border-slate-300 text-slate-600 active:bg-slate-100' },
                { id: 'medium', label: 'Medium', color: 'border-amber-300 text-amber-700 active:bg-amber-100' },
                { id: 'high', label: 'High', color: 'border-rose-300 text-rose-700 active:bg-rose-100' },
              ].map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPriority(p.id)}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                    priority === p.id
                      ? p.id === 'high'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : p.id === 'medium'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-slate-700 text-white border-slate-700 shadow-sm'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {priority === p.id && <Check className="w-3.5 h-3.5" />}
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Status Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition cursor-pointer"
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Due Date & Quick presets */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">Due Date</label>
              <div className="flex items-center gap-1.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setPresetDate(0)}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Today
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setPresetDate(1)}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  Tomorrow
                </button>
                <span className="text-slate-300">•</span>
                <button
                  type="button"
                  onClick={() => setPresetDate(7)}
                  className="text-indigo-600 hover:underline cursor-pointer"
                >
                  +1 Week
                </button>
                {dueDate && (
                  <>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setDueDate('')}
                      className="text-rose-600 hover:underline cursor-pointer"
                    >
                      Clear
                    </button>
                  </>
                )}
              </div>
            </div>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Tags <span className="text-slate-400 font-normal">(comma-separated)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="frontend, bug, urgent, docs"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 rounded-lg shadow-sm transition cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Saving...' : taskToEdit ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
