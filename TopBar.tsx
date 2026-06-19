/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Bell, Shield, Calendar, Search, Menu } from 'lucide-react';
import { useAppHelper } from './AppContext';
import { formatINR } from './utils';

export const TopBar: React.FC<{ onMobileMenuToggle?: () => void }> = ({ onMobileMenuToggle }) => {
  const { currentUser, clients, tasks } = useAppHelper();
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  // Overdue count
  const overdueTasksCount = tasks.filter(t => t.status === 'overdue').length;

  // Total Saved Penalty Platform-Wide
  const totalSavedPenalty = clients.reduce((sum, c) => sum + c.totalSavedPenalty, 0);

  // Active notifications list (from overdue and FSSAI expiring docs)
  const notifications = [
    { id: 1, text: 'Sharma Clinic compliance status is At Risk (78% Compliance)', type: 'alert' },
    { id: 2, text: 'FSSAI License for Patel Restaurant expires in 14 days!', type: 'critical' },
    { id: 3, text: 'Gupta Traders marked GSTR-1 as completed successfully.', type: 'info' }
  ];

  return (
    <header className="h-16 bg-white border-b border-[#E2E8F0] px-6 flex items-center justify-between shadow-xs shrink-0 select-none font-sans z-30 relative justify-items-stretch">
      {/* Search / Left bar info */}
      <div className="flex items-center gap-4">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-1.5 focus:outline-none hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
          >
            <Menu className="w-5 h-5 text-slate-700" />
          </button>
        )}
        <div className="hidden sm:flex items-center gap-2 text-slate-700">
          <Shield className="w-4 h-4 text-[#F97316]" />
          <span className="text-sm font-bold font-display tracking-tight text-slate-800">
            {currentUser?.firmName || 'Practice Workspace'}
          </span>
          <span className="text-xs bg-[#0F766E]/10 text-[#0F766E] border border-[#0F766E]/20 px-2 py-0.5 rounded-full font-bold">
            {currentUser?.plan || 'Starter'}
          </span>
        </div>
      </div>

      {/* Right panel indicators */}
      <div className="flex items-center gap-5">
        {/* Penalty Savings Hook */}
        <div className="hidden lg:flex flex-col items-end pr-2 border-r border-[#E2E8F0]">
          <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider">
            Client Penalties Saved
          </span>
          <span className="text-base font-bold font-mono text-[#0F766E]">
            {formatINR(totalSavedPenalty)}
          </span>
        </div>

        {/* Overdue Task Counter */}
        <div className="hidden sm:flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4 text-red-500" />
          <span className="text-xs font-semibold text-red-700 font-mono">
            {overdueTasksCount} OVERDUE
          </span>
        </div>

        {/* Notification Bell with Menu */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="p-2 border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors shrink-0 relative cursor-pointer"
            aria-label="Notification center"
          >
            <Bell className="w-4 h-4 text-slate-600 pointer-events-none" />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#F97316] rounded-full border border-white" />
            )}
          </button>

          {showNotificationMenu && (
            <div className="absolute right-0 mt-3 w-80 bg-white border border-[#E2E8F0] rounded-xl shadow-lg z-50 p-4">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-3">
                Live Practice Notifications
              </h4>
              <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="text-xs p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-700 hover:bg-slate-100">
                    {n.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Information Profile */}
        <div className="flex items-center gap-2.5">
          <img
            src={currentUser?.avatar || 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=200'}
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-slate-200 object-cover"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-700 leading-none">
              {currentUser?.name || 'Practitioner'}
            </span>
            <span className="text-[10px] text-slate-400 font-mono leading-tight mt-0.5">
              Ref: {currentUser?.caRegistrationNumber}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
