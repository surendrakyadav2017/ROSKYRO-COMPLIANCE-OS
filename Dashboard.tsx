/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { formatINR, ANCHOR_DATE } from './utils';
import { Card, CardHeader, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import { ProgressRing } from './ProgressRing';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import {
  ShieldAlert,
  Calendar,
  AlertTriangle,
  Award,
  CircleDot,
  CheckCircle2,
  Trash2,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { clients, tasks, activityLogs, completeTask, setActiveTab, setSelectedClientId } = useAppHelper();
  
  const [completeTaskId, setCompleteTaskId] = useState<string | null>(null);
  const [ackNum, setAckNum] = useState('');

  // 1. Calculations for Hero KPI's
  const activeClientsCount = clients.length;
  
  // Platform-wide compliance rate: average compliance of all clients
  const avgComplianceRate = clients.length
    ? Math.round(clients.reduce((sum, c) => sum + c.complianceScore, 0) / clients.length)
    : 100;

  // Overdue tasks count
  const overdueTasks = tasks.filter(t => t.status === 'overdue');
  const overdueCount = overdueTasks.length;

  // Cumulative penalties saved platform-wide from founder's monetization page
  const totalPenaltiesSaved = clients.reduce((sum, c) => sum + c.totalSavedPenalty, 0);

  // 2. Upcoming Deadlines inside next 7 days from anchor date (2026-06-15)
  const anchorDateObj = new Date(ANCHOR_DATE);
  const upcomingTasks = tasks.filter(t => {
    if (t.status === 'completed') return false;
    const taskDate = new Date(t.dueDate);
    const diffTime = taskDate.getTime() - anchorDateObj.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    // Due within next 7 days & not in the past
    return diffDays >= 0 && diffDays <= 7;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Helper for Days Left:
  const getDaysLeftText = (dueDateStr: string) => {
    const due = new Date(dueDateStr);
    const diff = due.getTime() - anchorDateObj.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return 'DUE TODAY';
    if (days === 1) return '1 Day Left';
    return `${days} Days Left`;
  };

  // 3. Client Health Status breakdown for Recharts Pie
  // Status: compliant, active/at_risk, inactive
  const statusCounts = clients.reduce((accum, c) => {
    accum[c.status] = (accum[c.status] || 0) + 1;
    return accum;
  }, {} as Record<string, number>);

  const healthChartData = [
    { name: 'Compliant', value: statusCounts['compliant'] || 0, color: '#0F766E' },
    { name: 'Active (On Track)', value: statusCounts['active'] || 0, color: '#1E3A5F' },
    { name: 'At Risk', value: statusCounts['at_risk'] || 0, color: '#F97316' },
    { name: 'Inactive', value: statusCounts['inactive'] || 0, color: '#94A3B8' }
  ].filter(item => item.value > 0);

  // 4. Recent Activity logs
  // Limit to most recent 10 logs
  const sortedLogs = [...activityLogs]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  // Helper for relative timestamps:
  const getRelativeTimeText = (isoStr: string) => {
    const logTime = new Date(isoStr);
    const anchor = new Date(ANCHOR_DATE);
    const diffMs = anchor.getTime() - logTime.getTime();
    const diffMin = Math.floor(diffMs / (1000 * 60));
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    return `${diffDay}d ago`;
  };

  const getTaskBadgeColor = (type: string) => {
    switch (type) {
      case 'GST': return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'TDS': return 'bg-[#7C3AED]/10 text-[#7C3AED] border-[#7C3AED]/20';
      case 'ROC': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Advance Tax': return 'bg-rose-50 text-rose-700 border-rose-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  // 5. Monthly Filing Grid (June 2026)
  // Calendar month rendering for June 2026 
  const june2026Days = Array.from({ length: 30 }, (_, idx) => idx + 1);
  const tasksInJune = tasks.filter(t => {
    const due = new Date(t.dueDate);
    return due.getFullYear() === 2026 && due.getMonth() === 5; // June is month index 5
  });

  const handleOpenCompleteModal = (taskId: string) => {
    setCompleteTaskId(taskId);
    setAckNum(`ACK${Math.floor(100000000 + Math.random() * 900000000)}`);
  };

  const handleConfirmComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (completeTaskId && ackNum) {
      completeTask(completeTaskId, ackNum);
      setCompleteTaskId(null);
    }
  };

  const handleClientRowSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setActiveTab('clients');
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      {/* Monetization Proactive ROI Notification */}
      <div className="bg-[#0F766E]/5 rounded-xl border border-[#0F766E]/15 p-4 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="bg-[#0F766E] text-white p-2 rounded-lg">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-[#0F766E] font-display select-text">
              ROSKYRO — Compliance Savings Unlocked
            </h3>
            <p className="text-xs text-slate-500 font-semibold select-text mt-0.5">
              "You've saved <strong className="text-[#0F766E]">{formatINR(totalPenaltiesSaved)}</strong> in penalties this year by staying compliant." — Premium Customer Retention Active.
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('reports')}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline cursor-pointer"
        >
          <span>View Reports Ledger</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Hero KPI Stripe */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 select-none">
        {/* KPI 1: Compliance Rate */}
        <Card hoverEffect className="flex items-center justify-between p-5">
          <div className="text-left font-sans flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Compliance Rate
            </span>
            <span className={`text-2xl font-extrabold font-display leading-none mt-1 ${
              avgComplianceRate >= 80 ? 'text-[#0F766E]' : avgComplianceRate >= 60 ? 'text-[#F97316]' : 'text-red-600'
            }`}>
              {avgComplianceRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Standard of 5 Clients</span>
          </div>
          <div className="shrink-0">
            <ProgressRing score={avgComplianceRate} size={44} strokeWidth={4.2} />
          </div>
        </Card>

        {/* KPI 2: Active Clients */}
        <Card hoverEffect className="p-5 flex items-center justify-between">
          <div className="text-left font-sans flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Active Clients
            </span>
            <span className="text-2xl font-extrabold font-display text-[#1E3A5F] leading-none mt-1">
              {activeClientsCount} <span className="text-xs font-semibold text-slate-400">accounts</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Starter subscription track</span>
          </div>
          <div className="bg-[#1E3A5F]/10 text-[#1E3A5F] p-2.5 rounded-lg border border-[#1E3A5F]/10">
            <CircleDot className="w-5 h-5" />
          </div>
        </Card>

        {/* KPI 3: Overdue Tasks */}
        <Card hoverEffect className="p-5 flex items-center justify-between">
          <div className="text-left font-sans flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Overdue Tasks
            </span>
            <span className={`text-2xl font-extrabold font-display leading-none mt-1 ${
              overdueCount > 0 ? 'text-red-600' : 'text-[#0F766E]'
            }`}>
              {overdueCount} <span className="text-xs font-semibold text-slate-400">pending</span>
            </span>
            {overdueCount > 0 ? (
              <span className="text-[10px] bg-red-50 text-red-700 px-1.5 py-0.5 border border-red-100 rounded-md font-bold mt-1.5 w-fit">
                CRITICAL WARNING
              </span>
            ) : (
              <span className="text-[10px] text-[#0F766E] font-bold">100% compliant state</span>
            )}
          </div>
          <div className={`p-2.5 rounded-lg border ${
            overdueCount > 0 ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 text-slate-400 border-slate-100'
          }`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </Card>

        {/* KPI 4: Penalties Saved */}
        <Card hoverEffect className="p-5 flex items-center justify-between">
          <div className="text-left font-sans flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Penalties Saved
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#0F766E] leading-none mt-1">
              {formatINR(totalPenaltiesSaved)}
            </span>
            <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded-md border border-emerald-100 w-fit">
              94% accuracy rating
            </span>
          </div>
          <div className="bg-emerald-50 text-[#0F766E] p-2.5 rounded-lg border border-emerald-100">
            <Award className="w-5 h-5 text-[#0F766E]" />
          </div>
        </Card>
      </div>

      {/* Grid: Deadlines and Client Health chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deadlines list (2 columns) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wider mb-1">
            ⚡ Upcoming Deadlines (Next 7 Days)
          </h3>
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="overflow-y-auto max-h-[380px] p-5 divide-y divide-slate-100">
              {upcomingTasks.length === 0 ? (
                <div className="py-12 text-center text-slate-400 font-sans flex flex-col items-center justify-center gap-2">
                  <CheckCircle2 className="w-9 h-9 text-[#0F766E]/50" />
                  <p className="text-xs font-bold text-slate-500">Perfect Streak!</p>
                  <p className="text-[11px]">There are no compliance deadlines in the next 7 days.</p>
                </div>
              ) : (
                upcomingTasks.map(task => (
                  <div key={task.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`inline-block text-[9px] font-bold border px-2 py-0.5 rounded-sm font-mono tracking-tight ${getTaskBadgeColor(task.type)}`}>
                          {task.type}
                        </span>
                        <span
                          onClick={() => handleClientRowSelect(task.clientId)}
                          className="text-[11px] font-bold text-slate-500 hover:text-[#1E3A5F] hover:underline cursor-pointer truncate"
                        >
                          {task.clientName}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-800 truncate select-text">
                        {task.name} ({task.shortCode})
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium font-mono mt-0.5">
                        Due: {new Date(task.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-[11px] bg-[#F97316]/10 text-[#F97316] px-2 py-1 border border-[#F97316]/20 rounded-md font-bold font-mono">
                        {getDaysLeftText(task.dueDate)}
                      </span>
                      <Button size="sm" onClick={() => handleOpenCompleteModal(task.id)}>
                        Mark File
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Client Health summary widget */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wider mb-1">
            📊 Client Health Distribution
          </h3>
          <Card className="p-5 flex flex-col justify-between align-middle h-full min-h-[300px]">
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={healthChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {healthChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => [`${v} account(s)`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Custom chart legend */}
            <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-semibold text-slate-600">
              {healthChartData.map(item => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="truncate">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Audit activities log & Calendar grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar (2 columns on large screen to fit properly) */}
        <div className="lg:col-span-2 flex flex-col gap-3">
          <h3 className="text-sm font-bold font-display text-[#1E3A5F] uppercase tracking-wider mb-1">
            📅 Monthly Filing Calendar Mini-View (June 2026)
          </h3>
          <Card className="p-5 font-sans">
            <div className="flex items-center justify-between mb-4 border-b border-slate-50 pb-3">
              <span className="text-sm font-extrabold text-[#1E3A5F] font-display uppercase tracking-wide">
                June 2026
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                Dots denote deadline days
              </span>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {/* Calendar weekdays header */}
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
                <div key={wd} className="text-xs font-bold text-slate-400 py-1.5 uppercase tracking-wide font-display">
                  {wd}
                </div>
              ))}

              {/* Blank spacers for June 1st, 2026 starting on Monday - June 1 2026 is actually Monday! so no spacers needed. */}
              {june2026Days.map(day => {
                const dayStr = `2026-06-${String(day).padStart(2, '0')}`;
                const daysTasks = tasksInJune.filter(t => t.dueDate === dayStr);
                
                // Colors indicator
                return (
                  <div key={day} className="border border-slate-50 bg-slate-50/50 rounded-lg p-1.5 min-h-[50px] relative flex flex-col justify-between hover:bg-slate-100 transition-colors">
                    <span className="text-xs font-bold font-mono text-slate-500 text-left">
                      {day}
                    </span>
                    {daysTasks.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1 justify-end max-w-full">
                        {daysTasks.slice(0, 3).map(tk => (
                          <span
                            key={tk.id}
                            className={`w-2 h-2 rounded-full cursor-help hover:scale-125 transition-transform ${
                              tk.status === 'completed'
                                ? 'bg-[#0F766E]'
                                : tk.status === 'overdue'
                                ? 'bg-red-500 animate-pulse'
                                : 'bg-[#F97316]'
                            }`}
                            title={`${tk.clientName}: ${tk.name}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Recent logs */}
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wider mb-1">
            📜 Recent Practice Activities
          </h3>
          <Card className="flex-1 overflow-hidden flex flex-col">
            <div className="p-4 overflow-y-auto max-h-[380px] divide-y divide-slate-100">
              {sortedLogs.map(log => (
                <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex items-start gap-2.5">
                  <div className="bg-slate-100 text-[#1E3A5F] p-1.5 rounded-lg shrink-0 mt-0.5 border border-slate-200/50">
                    <CircleDot className="w-3.5 h-3.5 text-[#1E3A5F]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-700 leading-tight select-text">
                      {log.description}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1 font-mono text-[9px] text-slate-400 font-bold">
                      <span>By {log.actor}</span>
                      <span>•</span>
                      <span>{getRelativeTimeText(log.timestamp)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Completion acknowledgement dialog */}
      {completeTaskId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl border border-slate-100 shadow-xl max-w-sm w-full p-6 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Confirm Completion File
            </h3>
            <p className="text-xs text-slate-400 mt-1 pb-2">
              Mark task complete and log details into audit ledger.
            </p>
            <form onSubmit={handleConfirmComplete} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  Acknowledgement Number (Challan Ref)
                </label>
                <input
                  type="text"
                  required
                  value={ackNum}
                  onChange={e => setAckNum(e.target.value)}
                  className="w-full text-xs font-bold font-mono px-3 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F] rounded-lg"
                />
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="secondary" size="sm" onClick={() => setCompleteTaskId(null)}>
                  Cancel
                </Button>
                <Button variant="success" size="sm" type="submit">
                  Verify & Complete
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
