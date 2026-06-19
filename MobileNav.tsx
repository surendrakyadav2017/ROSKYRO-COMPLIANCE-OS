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
  Settings,
} from 'lucide-react';
import { useAppHelper } from './AppContext';

export const MobileNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser } = useAppHelper();

  const isClient = currentUser?.role === 'client';

  const mobileTabs = isClient
    ? [
        { id: 'client_dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'client_tasks', label: 'Filings', icon: CheckSquare },
        { id: 'client_documents', label: 'Documents', icon: FileText },
      ]
    : [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'clients', label: 'Clients', icon: Users },
        { id: 'tasks', label: 'Tasks', icon: CheckSquare },
        { id: 'documents', label: 'Vault', icon: FileText },
        { id: 'settings', label: 'Settings', icon: Settings },
      ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-200 shadow-lg z-40 flex items-center justify-around px-2 select-none font-sans">
      {mobileTabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-1 py-1 px-3 transition-colors cursor-pointer ${
              isActive ? 'text-[#1E3A5F]' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className={`w-5 h-5 pointer-events-none ${isActive ? 'text-[#F97316]' : 'text-slate-400'}`} />
            <span className="text-[10px] font-bold tracking-tight">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
