/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckSquare, Calendar, AlertTriangle, ShieldCheck, Clock } from 'lucide-react';
import { Task } from './types';
import { Badge } from './Badge';
import { Button } from './Button';
import { formatINR, ANCHOR_DATE } from './utils';

interface TaskRowProps {
  task: Task;
  onComplete: (taskId: string, ackNumber: string) => void;
  hideClientName?: boolean;
}

export const TaskRow: React.FC<TaskRowProps> = ({ task, onComplete, hideClientName = false }) => {
  const [showAckInputModal, setShowAckInputModal] = useState(false);
  const [ackNumber, setAckNumber] = useState('');

  const getTaskTypeVariant = (type: Task['type']) => {
    switch (type) {
      case 'GST': return 'primary';
      case 'TDS': return 'secondary';
      case 'ROC': return 'info';
      case 'Advance Tax': return 'danger';
      case 'License': return 'warning';
      case 'Professional Tax': return 'success';
      default: return 'neutral';
    }
  };

  const isOverdue = task.status === 'overdue';

  const getDaysOverdue = () => {
    const due = new Date(task.dueDate);
    const anchor = new Date(ANCHOR_DATE);
    const diff = anchor.getTime() - due.getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  };

  const handleOpenCompleteModal = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Pre-populate ack number so they can see an example or edit it
    setAckNumber(`ACK${Math.floor(100000000 + Math.random() * 900000000)}`);
    setShowAckInputModal(true);
  };

  const handleConfirmCompletion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ackNumber.trim()) return;
    onComplete(task.id, ackNumber);
    setShowAckInputModal(false);
  };

  return (
    <div className={`p-4 rounded-xl border bg-white shadow-[0_1px_3px_rgba(0,0,0,0.06)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 select-none font-sans transition-all duration-150 ${
      isOverdue ? 'border-red-200 border-l-4 border-l-red-500 hover:border-red-300' : 'border-[#E2E8F0] hover:border-slate-300'
    }`}>
      {/* Left items of the row */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <Badge variant={getTaskTypeVariant(task.type)}>{task.type}</Badge>
          <span className="text-xs font-bold text-slate-700 font-mono tracking-tight bg-slate-100 px-1.5 py-0.5 rounded-sm">
            {task.shortCode}
          </span>
          <span className="text-xs text-slate-400 font-medium">
            • {task.filingPeriod}
          </span>
          {!hideClientName && (
            <span className="text-xs text-slate-500 font-bold ml-1 bg-slate-50 px-2 py-0.5 border border-slate-100 rounded-md">
              {task.clientName}
            </span>
          )}
        </div>

        <h4 className="text-sm font-bold text-slate-800 line-clamp-1">
          {task.name}
        </h4>
        <p className="text-xs text-slate-400 mt-1 line-clamp-2 pr-4 leading-relaxed font-medium">
          {task.description}
        </p>

        {/* Status flags or details */}
        {task.status === 'completed' && (
          <div className="mt-3 bg-[#0F766E]/5 rounded-lg p-2 border border-[#0F766E]/10 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-[#0F766E] font-medium">
            <span className="flex items-center gap-1 font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Filed Successfully</span>
            </span>
            <span className="font-mono">Govt Ref: {task.governmentAckNumber}</span>
            <span className="text-[#64748B]">By {task.completedBy}</span>
          </div>
        )}
      </div>

      {/* Right items of the row - action, deadlines, penalties */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 shrink-0 justify-between sm:justify-end">
        {/* Deadline information */}
        <div className="flex flex-col text-left sm:text-right font-sans">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider font-mono">
            DUE DATE
          </div>
          <div className="text-xs font-semibold text-slate-700 font-mono flex items-center gap-1.5 sm:justify-end mt-0.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            {new Date(task.dueDate).toLocaleDateString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
            })}
          </div>

          {/* Overdue/Accrued Warnings */}
          {isOverdue && (
            <div className="text-xs font-bold text-red-600 flex items-center gap-1 mt-1 font-mono">
              <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
              <span>{getDaysOverdue()} days overdue</span>
            </div>
          )}
        </div>

        {/* Penalty breakdown column */}
        {(isOverdue || task.totalPenaltyAccrued > 0) && (
          <div className="flex flex-col text-left sm:text-right pr-2">
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold text-red-400">
              Penalty Accrued
            </span>
            <span className="text-xs font-bold text-red-700 font-mono mt-0.5">
              {formatINR(isOverdue ? getDaysOverdue() * task.penaltyPerDay : task.totalPenaltyAccrued)}
            </span>
            <span className="text-[9px] text-slate-400 font-mono leading-none">
              (₹{task.penaltyPerDay}/day)
            </span>
          </div>
        )}

        {/* Action Button */}
        {task.status !== 'completed' ? (
          <Button
            size="sm"
            variant={isOverdue ? 'accent' : 'primary'}
            onClick={handleOpenCompleteModal}
            className="flex items-center gap-1 font-bold"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Mark Complete</span>
          </Button>
        ) : (
          <div className="text-[#0F766E] bg-[#0F766E]/10 px-3 py-1.5 rounded-lg border border-[#0F766E]/20 text-xs font-extrabold tracking-wide font-display flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" />
            <span>COMPLETED</span>
          </div>
        )}
      </div>

      {/* Govt Acknowledgement Number Input Modal */}
      {showAckInputModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-slate-900">
                Confirm Compliance Completion
              </h3>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              To mark <strong className="text-slate-800">"{task.name}"</strong> as filed, enter the government-issued Acknowledgement or Challan Reference number.
            </p>
            <form onSubmit={handleConfirmCompletion} className="flex flex-col gap-4">
              <div>
                <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  Acknowledgement Number (Required)
                </label>
                <input
                  type="text"
                  required
                  value={ackNumber}
                  onChange={e => setAckNumber(e.target.value)}
                  placeholder="e.g. ACK987421289"
                  className="w-full text-xs font-bold font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F] focus:border-[#1E3A5F]"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <Button variant="secondary" size="sm" onClick={() => setShowAckInputModal(false)}>
                  Cancel
                </Button>
                <Button variant="success" size="sm" type="submit">
                  Verify & Mark Complete
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
