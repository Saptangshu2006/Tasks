import React from 'react';
import {
  Search,
  X,
  Filter,
  ArrowUpDown,
  LayoutGrid,
  Kanban,
  List,
  RotateCcw,
  Tag,
  Calendar,
  AlertCircle
} from 'lucide-react';

export default function TaskFilters({
  filters,
  onFilterChange,
  onResetFilters,
  availableTags = [],
  viewMode,
  onViewModeChange,
  totalResults = 0,
}) {
  const isAnyFilterActive =
    filters.search ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.dueFilter !== 'all' ||
    filters.tag !== 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-sm mb-6 space-y-4">
      {/* Search and View Controls Row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search tasks by title or description..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="w-full pl-9 pr-9 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange('search', '')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg self-end sm:self-auto">
          <button
            onClick={() => onViewModeChange('grid')}
            title="Grid View"
            className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'grid'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            <span className="hidden md:inline">Cards</span>
          </button>
          <button
            onClick={() => onViewModeChange('kanban')}
            title="Kanban Board View"
            className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'kanban'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Kanban className="w-4 h-4" />
            <span className="hidden md:inline">Board</span>
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            title="Compact List View"
            className={`p-1.5 rounded-md text-xs font-medium transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'list'
                ? 'bg-white text-indigo-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <List className="w-4 h-4" />
            <span className="hidden md:inline">List</span>
          </button>
        </div>
      </div>

      {/* Filter Selectors Bar */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
        {/* Status Dropdown */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">Status:</span>
          <select
            value={filters.status}
            onChange={(e) => onFilterChange('status', e.target.value)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority Dropdown */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <span className="text-slate-400 font-medium">Priority:</span>
          <select
            value={filters.priority}
            onChange={(e) => onFilterChange('priority', e.target.value)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        {/* Due Date Filter */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={filters.dueFilter}
            onChange={(e) => onFilterChange('dueFilter', e.target.value)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="all">All Dates</option>
            <option value="today">Due Today</option>
            <option value="upcoming">Upcoming</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Tag Filter (if tags exist) */}
        {availableTags.length > 0 && (
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filters.tag}
              onChange={(e) => onFilterChange('tag', e.target.value)}
              className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="all">All Tags</option>
              {availableTags.map((t) => (
                <option key={t} value={t}>
                  #{t}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort By */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 ml-auto">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400 font-medium">Sort:</span>
          <select
            value={filters.sortBy}
            onChange={(e) => onFilterChange('sortBy', e.target.value)}
            className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="createdAt">Date Created</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
            <option value="title">Title</option>
          </select>
          <button
            onClick={() => onFilterChange('order', filters.order === 'asc' ? 'desc' : 'asc')}
            title={`Sort order: ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
            className="text-slate-500 hover:text-indigo-600 px-1 py-0.5 rounded cursor-pointer font-bold uppercase text-[10px]"
          >
            {filters.order === 'asc' ? 'ASC ↑' : 'DESC ↓'}
          </button>
        </div>

        {/* Reset Filter Button */}
        {isAnyFilterActive && (
          <button
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-rose-600 bg-rose-50 hover:bg-rose-100 transition cursor-pointer font-medium text-xs border border-rose-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Results counter */}
      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>
          Showing <span className="font-semibold text-slate-700">{totalResults}</span> {totalResults === 1 ? 'task' : 'tasks'}
        </span>
        {isAnyFilterActive && (
          <span className="text-indigo-600 font-medium">Filters Applied</span>
        )}
      </div>
    </div>
  );
}
