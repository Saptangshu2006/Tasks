import React from 'react';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Plus, LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar({ onOpenCreateModal }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white shadow-md shadow-indigo-100">
              <CheckSquare className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-indigo-900 bg-clip-text text-transparent">
                TaskPulse
              </span>
              <span className="hidden sm:inline-block ml-2 text-xs font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-full border border-indigo-100">
                MERN Stack
              </span>
            </div>
          </div>

          {/* User & Actions */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={onOpenCreateModal}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-sm font-medium shadow-sm transition-all duration-150 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Task</span>
            </button>

            <div className="h-6 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs uppercase">
                  {user?.name ? user.name[0] : 'U'}
                </div>
                <span className="font-medium hidden md:inline truncate max-w-[120px]">
                  {user?.name || 'User'}
                </span>
              </div>

              <button
                onClick={logout}
                title="Sign Out"
                className="p-2 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
