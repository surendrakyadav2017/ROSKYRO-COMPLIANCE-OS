/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  FileText,
  Bell,
  BarChart2,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAppHelper } from './AppContext';

interface SidebarProps {
  onSignOut?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onSignOut }) => {
  const { activeTab, setActiveTab, currentUser, setCurrentUser, showToast, setSelectedClientId } = useAppHelper();

  const isClient = currentUser?.role === 'client';

  const menuItems = isClient
    ? [
        { id: 'client_dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'client_tasks', label: 'My Filings', icon: CheckSquare },
        { id: 'client_documents', label: 'My Documents', icon: FileText },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'tasks', label: 'Task Calendar', icon: CheckSquare },
        { id: 'documents', label: 'Document Vault', icon: FileText },
        { id: 'reminders', label: 'Reminders', icon: Bell },
        { id: 'reports', label: 'Reports', icon: BarChart2 },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  const handleLogout = () => {
    if (onSignOut) {
      onSignOut();
    } else {
      setCurrentUser(null);
      if (setSelectedClientId) setSelectedClientId(null);
      setActiveTab(isClient ? 'client_dashboard' : 'dashboard');
    }
    showToast(isClient ? 'Logged out of Client Portal' : 'Logged out of CA Workspace', 'info');
  };

  return (
    <aside className="w-60 bg-[#1E3A5F] text-slate-200 min-h-screen hidden md:flex flex-col border-r border-[#152a45] shadow-lg shrink-0 font-sans select-none">
      {/* Brand Logo */}
      <div className="p-6 border-b border-[#152a45] flex items-center gap-3">
        <div className="bg-[#F97316] text-[#1E3A5F] w-9 h-9 rounded-lg flex items-center justify-center font-bold font-display text-xl tracking-tight shadow-md">
          R
        </div>
        <div>
          <h1 className="text-lg font-bold font-display text-white tracking-wide">
            ROSKYRO
          </h1>
          <p className="text-[10px] text-slate-400 font-mono tracking-wider">
            Compliance-OS
          </p>
        </div>
      </div>

      {/* Navigation menu */}
      <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 overflow-y-auto">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-lg text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-white/10 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              <Icon className={`w-5 h-5 pointer-events-none ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User practice box & logout */}
      <div className="p-4 border-t border-[#152a45] bg-[#152a45]/30">
        <div className="flex items-center gap-3 mb-4">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200'}
            alt="User Avatar"
            className="w-10 h-10 rounded-full border border-slate-500 object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-xs font-bold text-white truncate">
              {currentUser?.name || 'Practitioner Name'}
            </h4>
            <p className="text-[10px] text-slate-400 truncate">
              {currentUser?.firmName || 'Practice'}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#1E3A5F] hover:bg-black/10 active:bg-black/20 text-xs font-bold font-sans text-slate-400 hover:text-white rounded-lg border border-slate-600/30 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
