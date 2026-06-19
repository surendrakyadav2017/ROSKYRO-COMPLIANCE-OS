/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useAppHelper } from './AppContext';
import { Card } from './Card';
import { Badge } from './Badge';
import { CheckCircle2, ShieldAlert } from 'lucide-react';

export const ClientTasks: React.FC = () => {
  const { currentUser, clients, tasks } = useAppHelper();

  const linkedClient = clients.find(c => c.portalEmail.toLowerCase() === currentUser?.email.toLowerCase()) || clients[0];

  if (!linkedClient) return <div className="p-8 text-center text-slate-400">No linked business details found.</div>;

  const clientTasks = tasks
    .filter(t => t.clientId === linkedClient.id)
    .sort((a,b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
          Your Filing Task compliance tracker
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Review all completed, pending and overdue statutory filings handled by Yadav & Associates.
        </p>
      </div>

      <div className="space-y-4">
        {clientTasks.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-10 font-bold">No registered filing schedules.</p>
        ) : (
          clientTasks.map(t => (
            <Card key={t.id} className="p-4 flex items-center justify-between gap-4 font-sans select-none border-slate-200/50">
              <div>
                <div className="flex items-center gap-1.5 mb-1 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100 text-sky-700 w-fit text-[9px] font-bold">
                  {t.type}
                </div>
                <h4 className="text-xs font-bold text-slate-800">
                  {t.name} ({t.shortCode})
                </h4>
                <p className="text-[10px] text-slate-400 font-bold font-mono mt-0.5">
                  Statutory Deadline: {new Date(t.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>

              <div className="flex items-center gap-2shrink-0">
                {t.status === 'completed' ? (
                  <div className="flex items-center gap-1 text-[#0F766E] bg-[#0F766E]/5 px-2.5 py-1 rounded-lg border border-[#0F766E]/10 text-xs font-bold font-display">
                    <CheckCircle2 className="w-4 h-4 text-[#0F766E]" />
                    <span>✓ Completed ({t.acknowledgementNumber})</span>
                  </div>
                ) : t.status === 'overdue' ? (
                  <div className="flex items-center gap-1 text-red-600 bg-red-50 px-2.5 py-1 rounded-lg border border-red-100 text-xs font-bold font-display animate-pulse">
                    <ShieldAlert className="w-4 h-4 text-red-500" />
                    <span>Overdue</span>
                  </div>
                ) : (
                  <div className="text-amber-600 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 text-xs font-bold font-display select-none">
                    Pending Book Upload
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
