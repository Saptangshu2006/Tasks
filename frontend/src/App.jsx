import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from './context/AuthContext';
import { taskApi } from './services/api';
import Navbar from './components/Navbar';
import AuthModal from './components/AuthModal';
import TaskStats from './components/TaskStats';
import TaskFilters from './components/TaskFilters';
import TaskCard from './components/TaskCard';
import KanbanView from './components/KanbanView';
import CompactListView from './components/CompactListView';
import TaskFormModal from './components/TaskFormModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import Toast from './components/Toast';
import { Plus, Inbox, Sparkles, RefreshCw } from 'lucide-react';

export default function App() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();

  // Tasks and Dashboard State
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loadingTasks, setLoadingTasks] = useState(false);

  // Filters State
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    priority: 'all',
    dueFilter: 'all',
    tag: 'all',
    sortBy: 'createdAt',
    order: 'desc',
  });

  // UI View Mode: 'grid' | 'kanban' | 'list'
  const [viewMode, setViewMode] = useState('grid');

  // Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Toast feedback
  const [toast, setToast] = useState({ message: '', type: 'success' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // Fetch tasks and stats from backend
  const fetchTasksAndStats = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoadingTasks(true);
    try {
      const [tasksData, statsData] = await Promise.all([
        taskApi.getTasks(filters),
        taskApi.getStats(),
      ]);
      setTasks(tasksData);
      setStats(statsData);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      showToast(err.message || 'Failed to load tasks', 'error');
    } finally {
      setLoadingTasks(false);
    }
  }, [isAuthenticated, filters]);

  useEffect(() => {
    fetchTasksAndStats();
  }, [fetchTasksAndStats]);

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      priority: 'all',
      dueFilter: 'all',
      tag: 'all',
      sortBy: 'createdAt',
      order: 'desc',
    });
  };

  // Task CRUD operations
  const handleCreateOrUpdateTask = async (taskPayload) => {
    if (taskToEdit) {
      const updated = await taskApi.updateTask(taskToEdit._id, taskPayload);
      showToast('Task updated successfully!', 'success');
    } else {
      await taskApi.createTask(taskPayload);
      showToast('Task created successfully!', 'success');
    }
    fetchTasksAndStats();
  };

  const handleQuickStatusChange = async (taskId, newStatus) => {
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
    );

    try {
      await taskApi.updateTask(taskId, { status: newStatus });
      showToast(`Status changed to ${newStatus.replace('_', ' ')}`, 'info');
      // Refresh stats in background
      taskApi.getStats().then(setStats);
    } catch (err) {
      showToast(err.message || 'Failed to update status', 'error');
      fetchTasksAndStats();
    }
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;
    setDeleteLoading(true);
    try {
      await taskApi.deleteTask(taskToDelete._id);
      showToast('Task deleted successfully', 'success');
      setTaskToDelete(null);
      fetchTasksAndStats();
    } catch (err) {
      showToast(err.message || 'Failed to delete task', 'error');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Seed sample tasks for instant delight
  const handleSeedSampleTasks = async () => {
    setLoadingTasks(true);
    try {
      const sampleTasks = [
        {
          title: 'Design high-fidelity dashboard wireframes',
          description: 'Sketch out modern responsive layouts for mobile and desktop screens.',
          status: 'completed',
          priority: 'high',
          tags: ['design', 'ui/ux'],
          dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        },
        {
          title: 'Implement JWT User Authentication & Route Guard',
          description: 'Set up bcrypt password hashing and token verification middleware on Express API.',
          status: 'in_progress',
          priority: 'high',
          tags: ['backend', 'security'],
          dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
        },
        {
          title: 'Build multi-criteria task filtering and search',
          description: 'Support search by keywords, filter by priority, status, due dates and tags.',
          status: 'in_progress',
          priority: 'medium',
          tags: ['frontend', 'react'],
          dueDate: new Date(Date.now() + 172800000).toISOString(), // in 2 days
        },
        {
          title: 'Prepare production Dockerfile & deployment docs',
          description: 'Write Docker configuration and setup guidelines for cloud hosting.',
          status: 'pending',
          priority: 'low',
          tags: ['devops', 'docs'],
          dueDate: new Date(Date.now() + 432000000).toISOString(), // in 5 days
        },
        {
          title: 'Review quarterly server security vulnerabilities',
          description: 'Audit npm dependencies and apply security updates.',
          status: 'pending',
          priority: 'high',
          tags: ['security', 'maintenance'],
          dueDate: new Date(Date.now() - 172800000).toISOString(), // Overdue by 2 days
        },
      ];

      for (const t of sampleTasks) {
        await taskApi.createTask(t);
      }

      showToast('Sample tasks generated successfully!', 'success');
      fetchTasksAndStats();
    } catch (err) {
      showToast(err.message || 'Failed to seed sample tasks', 'error');
    } finally {
      setLoadingTasks(false);
    }
  };

  // Loading Screen while restoring session
  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-500">
        <div className="w-10 h-10 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-sm font-medium">Initializing TaskPulse...</p>
      </div>
    );
  }

  // Unauthenticated State: Show Auth Modal
  if (!isAuthenticated) {
    return <AuthModal />;
  }

  const isAnyFilterActive =
    filters.search ||
    filters.status !== 'all' ||
    filters.priority !== 'all' ||
    filters.dueFilter !== 'all' ||
    filters.tag !== 'all';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top Navigation */}
      <Navbar
        onOpenCreateModal={() => {
          setTaskToEdit(null);
          setIsFormModalOpen(true);
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Task Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Welcome back, <span className="font-semibold text-slate-700">{user?.name}</span>. Here's what's on your agenda.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {stats && stats.total === 0 && (
              <button
                onClick={handleSeedSampleTasks}
                disabled={loadingTasks}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet-50 text-violet-700 hover:bg-violet-100 border border-violet-200 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-violet-500" />
                <span>Load Sample Tasks</span>
              </button>
            )}

            <button
              onClick={fetchTasksAndStats}
              title="Refresh Tasks"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${loadingTasks ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dashboard Stats */}
        <TaskStats
          stats={stats}
          activeStatus={filters.status}
          onSelectStatus={(st) => handleFilterChange('status', st)}
          activeDueFilter={filters.dueFilter}
          onSelectDueFilter={(df) => handleFilterChange('dueFilter', df)}
        />

        {/* Filter & Search Bar */}
        <TaskFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          availableTags={stats?.tags || []}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          totalResults={tasks.length}
        />

        {/* Tasks Views */}
        {loadingTasks && tasks.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs">Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          /* Empty State */
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800 mb-1">
              {isAnyFilterActive ? 'No matching tasks found' : 'No tasks yet'}
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              {isAnyFilterActive
                ? 'Try adjusting your search criteria or resetting the applied filters.'
                : 'Get started by creating your first task or auto-populating with sample data.'}
            </p>
            <div className="flex items-center justify-center gap-3">
              {isAnyFilterActive ? (
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition cursor-pointer"
                >
                  Clear Filters
                </button>
              ) : (
                <>
                  <button
                    onClick={() => {
                      setTaskToEdit(null);
                      setIsFormModalOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Create Task</span>
                  </button>
                  <button
                    onClick={handleSeedSampleTasks}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Load Demo Tasks</span>
                  </button>
                </>
              )}
            </div>
          </div>
        ) : viewMode === 'kanban' ? (
          <KanbanView
            tasks={tasks}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsFormModalOpen(true);
            }}
            onDelete={(task) => setTaskToDelete(task)}
            onStatusChange={handleQuickStatusChange}
            onOpenCreateModal={() => {
              setTaskToEdit(null);
              setIsFormModalOpen(true);
            }}
          />
        ) : viewMode === 'list' ? (
          <CompactListView
            tasks={tasks}
            onEdit={(task) => {
              setTaskToEdit(task);
              setIsFormModalOpen(true);
            }}
            onDelete={(task) => setTaskToDelete(task)}
            onStatusChange={handleQuickStatusChange}
          />
        ) : (
          /* Cards Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => {
                  setTaskToEdit(t);
                  setIsFormModalOpen(true);
                }}
                onDelete={(t) => setTaskToDelete(t)}
                onStatusChange={handleQuickStatusChange}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Creation / Edit Modal */}
      <TaskFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setTaskToEdit(null);
        }}
        onSave={handleCreateOrUpdateTask}
        taskToEdit={taskToEdit}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={handleDeleteConfirm}
        taskTitle={taskToDelete?.title || ''}
        loading={deleteLoading}
      />

      {/* Feedback Toast */}
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: '', type: 'success' })}
      />
    </div>
  );
}
