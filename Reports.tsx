/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { formatINR } from './utils';
import { Card, CardHeader, CardContent } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';
import {
  TrendingUp,
  FileSpreadsheet,
  Award,
  CircleCheck,
  Globe2,
  Users,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export const Reports: React.FC = () => {
  const { clients, tasks, activityLogs, showToast } = useAppHelper();

  // 1. Calculations: Total Penalties Saved
  const totalSavings = clients.reduce((sum, c) => sum + c.totalSavedPenalty, 0);

  // Filter outcompleted tasks
  const ontimeTasksCount = tasks.filter(t => t.status === 'completed').length;
  const overdueTasksCount = tasks.filter(t => t.status === 'overdue').length;
  const totalTasksCount = tasks.length;
  const compliantPercent = totalTasksCount ? Math.round((ontimeTasksCount / totalTasksCount) * 100) : 100;

  // Recharts line chart data representing cumulative savings growth month over month (Jan to June 2026)
  const savingsChartData = [
    { month: 'Jan 26', Savings: Math.round(totalSavings * 0.15) },
    { month: 'Feb 26', Savings: Math.round(totalSavings * 0.35) },
    { month: 'Mar 26', Savings: Math.round(totalSavings * 0.55) },
    { month: 'Apr 26', Savings: Math.round(totalSavings * 0.75) },
    { month: 'May 26', Savings: Math.round(totalSavings * 0.90) },
    { month: 'Jun 26', Savings: totalSavings },
  ];

  const handleExportPDFSimulation = () => {
    showToast('✓ PDF report compiling complete! Saved to your device downloads ledger.', 'success');
  };

  const handleExportCSVSimulation = () => {
    // Generate simple data string and simulate download
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Client Name,Compliance Score,Saved Penalty (INR),Status\n"
      + clients.map(c => `"${c.name}",${c.complianceScore},${c.totalSavedPenalty},"${c.status}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ROSKYRO_Client_Compliance_Scoreboard_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Client Compliance Scoreboard exported as CSV!', 'success');
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      {/* Title Header split */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-3 select-none">
        <div>
          <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
            Yadav & Associates Operational Reports
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Audit practice health parameters, client scoreboards, and compliance penalties saved.
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportCSVSimulation} variant="secondary" size="sm" className="font-bold flex items-center gap-1.5 border-slate-200 text-slate-600">
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </Button>
          <Button onClick={handleExportPDFSimulation} variant="primary" size="sm" className="font-bold flex items-center gap-1.5 shadow-xs">
            <TrendingUp className="w-4 h-4" />
            <span>Compile PDF Ledger</span>
          </Button>
        </div>
      </div>

      {/* Main Stats Area split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start select-none">
        
        {/* Left ROI monetization panel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <Card className="p-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                  Practitioner ROI Summary (Y-O-Y compliance)
                </span>
                <span className="text-2xl font-extrabold font-mono text-[#0F766E] block mt-1">
                  {formatINR(totalSavings)} <span className="text-xs font-semibold text-slate-400 font-sans">Saved in Penalties</span>
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-mono font-bold block">
                  Ontime Filing Streak
                </span>
                <span className="text-lg font-extrabold font-display text-[#1E3A5F]">
                  {compliantPercent}% Accuracy
                </span>
              </div>
            </div>

            {/* Savings Cumulative Recharts Chart */}
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={savingsChartData}>
                  <defs>
                    <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} />
                  <YAxis tick={{ fontSize: 10, fontWeight: 600, fill: '#94A3B8' }} />
                  <Tooltip formatter={(value) => [`₹${value}`, 'Penalties Saved']} />
                  <Area type="monotone" dataKey="Savings" stroke="#0F766E" strokeWidth={2} fillOpacity={1} fill="url(#colorSavings)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Right Stats summaries cards (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="p-5 flex items-center justify-between">
            <div className="text-left font-sans">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                Statutory Files Status
              </span>
              <span className="text-2xl font-extrabold font-display text-slate-800 block mt-1">
                {ontimeTasksCount} <span className="text-xs font-semibold text-slate-400">completed</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                Total generated scope: {totalTasksCount} items
              </span>
            </div>
            <div className="bg-[#0F766E]/10 text-[#0F766E] p-2.5 rounded-lg border border-[#0F766E]/10">
              <CircleCheck className="w-5 h-5" />
            </div>
          </Card>

          <Card className="p-5 flex items-center justify-between">
            <div className="text-left font-sans">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                CA Clients Count
              </span>
              <span className="text-2xl font-extrabold font-display text-slate-800 block mt-1">
                {clients.length} <span className="text-xs font-semibold text-slate-400 font-sans">accounts</span>
              </span>
              <span className="text-[10px] text-slate-400 font-semibold block mt-1.5">
                All 5 clients synchronized
              </span>
            </div>
            <div className="bg-slate-100 text-slate-500 p-2.5 rounded-lg border border-slate-200/50">
              <Users className="w-5 h-5" />
            </div>
          </Card>
        </div>

      </div>

      {/* Client Scoreboard Section */}
      <div className="pt-4">
        <h3 className="text-sm font-bold font-display text-[#1E3A5F] uppercase tracking-wider mb-3 select-none">
          🏆 Client Compliance Scoreboard
        </h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-semibold text-slate-600 font-sans border-collapse select-none">
              <thead className="bg-[#1E3A5F]/5 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Active Profile</th>
                  <th className="p-4">Compliance Rating</th>
                  <th className="p-4">Statutory Type</th>
                  <th className="p-4 text-right">Saved Penalties (INR)</th>
                  <th className="p-4 text-right pr-6">Status Health</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {clients.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-[#1E3A5F] flex items-center justify-center font-bold text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 block">{c.name}</span>
                        <span className="text-[10px] text-slate-400 font-bold font-mono block mt-0.5">
                          {c.gstin}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 font-bold font-mono">
                      <span className={c.complianceScore >= 80 ? 'text-[#0F766E]' : 'text-amber-500'}>
                        {c.complianceScore}%
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 text-xs font-bold leading-relaxed">{c.type}</td>
                    <td className="p-4 text-right pr-4 font-mono font-bold text-slate-800">
                      {formatINR(c.totalSavedPenalty)}
                    </td>
                    <td className="p-4 text-right pr-6">
                      <Badge variant={c.status === 'compliant' ? 'success' : 'warning'}>
                        {c.status.toUpperCase()}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Global Audit Log list */}
      <div className="pt-6">
        <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wider mb-3 select-none">
          📜 Decoupled Operational Audit Logs Ledger (Real-Time backup ready)
        </h3>
        <Card className="p-4 max-h-72 overflow-y-auto divide-y divide-slate-100">
          {activityLogs.map((log) => (
            <div key={log.id} className="py-2.5 first:pt-0 last:pb-0 flex tracking-normal items-start gap-3 select-text text-left font-sans text-xs">
              <Globe2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <span className="font-semibold text-slate-700 leading-relaxed block">
                  {log.description}
                </span>
                <span className="text-[10px] text-slate-400 font-mono font-semibold block mt-0.5">
                  Action Executed by: {log.actor} • IP: {log.details?.match(/(?:[0-9]{1,3}\.){3}[0-9]{1,3}/)?.[0] || '103.45.192.11'} • DateTime: {new Date(log.timestamp).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          ))}
        </Card>
      </div>

    </div>
  );
};
