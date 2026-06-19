/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { Task } from './types';
import { TaskRow } from './TaskRow';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import {
  Calendar as CalIcon,
  List as ListIcon,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ListFilter,
  ShieldAlert,
} from 'lucide-react';
import { ANCHOR_DATE } from './utils';

export const TaskCalendar: React.FC = () => {
  const { tasks, completeTask, showToast } = useAppHelper();

  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');

  // List View Filter states
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Bulk select states
  const [bulkCheckedTaskIds, setBulkCheckedTaskIds] = useState<string[]>([]);

  // Calendar states
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(5); // June is 5 (0-indexed)
  const [selectedDayTasks, setSelectedDayTasks] = useState<Task[] | null>(null);
  const [selectedDayNum, setSelectedDayNum] = useState<number | null>(null);

  // Month navigation
  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(prev => prev - 1);
    } else {
      setCalendarMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(prev => prev + 1);
    } else {
      setCalendarMonth(prev => prev + 1);
    }
  };

  const monthName = new Date(calendarYear, calendarMonth).toLocaleString('default', { month: 'long' });

  // Filter and Sorting tasks
  const filteredTasks = tasks.filter(t => {
    const matchesType = selectedType === 'All' || t.type === selectedType;
    const matchesPriority = selectedPriority === 'All' || t.priority.toLowerCase() === selectedPriority.toLowerCase();
    const matchesStatus = selectedStatus === 'All' || t.status === selectedStatus;
    return matchesType && matchesPriority && matchesStatus;
  }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Bulk selections
  const handleCheckboxToggle = (taskId: string, isChecked: boolean) => {
    if (isChecked) {
      setBulkCheckedTaskIds(prev => [...prev, taskId]);
    } else {
      setBulkCheckedTaskIds(prev => prev.filter(id => id !== taskId));
    }
  };

  const handleBulkComplete = () => {
    if (bulkCheckedTaskIds.length === 0) return;
    const ackNumber = `BULK-ACK-${Math.floor(100000 + Math.random() * 900000)}`;
    bulkCheckedTaskIds.forEach(id => {
      completeTask(id, ackNumber);
    });
    setBulkCheckedTaskIds([]);
    showToast(`✓ Completed ${bulkCheckedTaskIds.length} tasks in bulk successfully.`, 'success');
  };

  // Calendar rendering formulas
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const firstDayIndex = new Date(calendarYear, calendarMonth, 1).getDay(); // Sunday=0, Monday=1 etc.
  const adjustedFirstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1; // Align to Monday starting index 

  const totalDaysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const leadingSpacers = Array.from({ length: adjustedFirstDayIndex });

  const getCalendarTaskColor = (type: string) => {
    switch (type) {
      case 'GST': return 'bg-sky-500';
      case 'TDS': return 'bg-amber-500';
      case 'ROC': return 'bg-purple-600';
      case 'License': return 'bg-teal-500';
      case 'Advance Tax': return 'bg-[#F97316]';
      case 'Professional Tax': return 'bg-emerald-500';
      default: return 'bg-slate-400';
    }
  };

  const dayClick = (day: number) => {
    const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const dayTasks = tasks.filter(t => t.dueDate === dateStr);
    setSelectedDayTasks(dayTasks);
    setSelectedDayNum(day);
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8 select-none">
      
      {/* Title Header split */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
            Statutory Task Calendar
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Verify upcoming, overdue, and completed filings across client cohorts.
          </p>
        </div>

        {/* Dual View Toggle */}
        <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200/50 shrink-0 select-none">
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === 'list' ? 'bg-white text-[#1E3A5F] shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <ListIcon className="w-4 h-4" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all ${
              viewMode === 'calendar' ? 'bg-white text-[#1E3A5F] shadow-xs' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <CalIcon className="w-4 h-4" />
            <span>Calendar View</span>
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        /* ================= LIST VIEW CONTENT ================= */
        <div className="space-y-4">
          
          {/* List View Filtering Strip */}
          <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 text-slate-400"><ListFilter className="w-4 h-4" /> Filters:</span>
              
              {/* Type Category Filter */}
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Types</option>
                <option value="GST">GST</option>
                <option value="TDS">TDS</option>
                <option value="ROC">ROC</option>
                <option value="License">License</option>
                <option value="Advance Tax">Advance Tax</option>
                <option value="Professional Tax">Professional Tax</option>
              </select>

              {/* Priority Filter */}
              <select
                value={selectedPriority}
                onChange={e => setSelectedPriority(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className="bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-bold text-slate-600 focus:outline-none cursor-pointer"
              >
                <option value="All">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="overdue">Overdue</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Bulk Completed Action */}
            {bulkCheckedTaskIds.length > 0 && (
              <Button onClick={handleBulkComplete} variant="success" size="sm" className="font-bold flex items-center gap-1.5 animate-in slide-in-from-right-4">
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark Selected as Complete ({bulkCheckedTaskIds.length})</span>
              </Button>
            )}
          </div>

          {/* Checklist Area */}
          <div className="flex flex-col gap-4">
            {filteredTasks.length === 0 ? (
              <div className="py-20 text-center text-slate-400 bg-white border border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center gap-2">
                <ShieldAlert className="w-10 h-10 text-slate-200" />
                <h4 className="text-sm font-bold text-slate-600">No tasks match filter queries</h4>
                <p className="text-xs">Adjust checklist parameters to see related legal obligations.</p>
              </div>
            ) : (
              filteredTasks.map(task => {
                const isSelected = bulkCheckedTaskIds.includes(task.id);
                const canCheck = task.status !== 'completed';
                return (
                  <div key={task.id} className="flex items-center gap-3">
                    {/* Checkbox selector for bulk operations */}
                    {canCheck ? (
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={e => handleCheckboxToggle(task.id, e.target.checked)}
                        className="w-4 w-4 h-4 shrink-0 rounded-md border-slate-300 accent-[#1E3A5F] cursor-pointer"
                      />
                    ) : (
                      <div className="w-4 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <TaskRow task={task} onComplete={completeTask} />
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      ) : (
        /* ================= CALENDAR VIEW CONTENT ================= */
        <div className="space-y-6">
          <Card className="p-6 font-sans">
            {/* Calendar Controls (prev, current month selector, next) */}
            <div className="flex items-center justify-between pb-5 border-b border-slate-100 mb-5">
              <h3 className="text-sm font-extrabold text-[#1E3A5F] font-display uppercase tracking-wider">
                {monthName} {calendarYear}
              </h3>
              <div className="flex gap-1">
                <button
                  onClick={handlePrevMonth}
                  className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-600" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Main Calendar Month Grid */}
            <div className="grid grid-cols-7 gap-2">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(wd => (
                <div key={wd} className="text-xs font-bold text-slate-400 py-1.5 uppercase font-display select-none">
                  {wd}
                </div>
              ))}

              {/* Blank leading spacers */}
              {leadingSpacers.map((_, idx) => (
                <div key={`spacer-${idx}`} className="bg-slate-50/20 border border-transparent rounded-lg p-1 min-h-[75px]" />
              ))}

              {/* Active days in the month */}
              {totalDaysArray.map(day => {
                const dateStr = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayTasks = tasks.filter(t => t.dueDate === dateStr);

                return (
                  <div
                    key={`day-${day}`}
                    onClick={() => dayClick(day)}
                    className={`border rounded-lg p-2 min-h-[75px] flex flex-col justify-between cursor-pointer transition-all ${
                      dayTasks.length > 0
                        ? 'border-[#1E3A5F]/15 bg-slate-50/50 hover:bg-[#1E3A5F]/5'
                        : 'border-slate-100 bg-white hover:bg-slate-50/50'
                    }`}
                  >
                    <span className="text-xs font-bold font-mono text-slate-500 text-left">
                      {day}
                    </span>

                    {/* Multi-dot preview */}
                    {dayTasks.length > 0 && (
                      <div className="flex flex-wrap gap-1 justify-end max-w-full">
                        {dayTasks.slice(0, 4).map(tk => (
                          <span
                            key={tk.id}
                            className={`w-2 h-2 rounded-full ${getCalendarTaskColor(tk.type)} shrink-0`}
                            title={`${tk.clientName}: ${tk.name}`}
                          />
                        ))}
                        {dayTasks.length > 4 && (
                          <span className="text-[8px] font-bold text-slate-400 font-mono">
                            +{dayTasks.length - 4}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Calendar Day Side drawer/modal detail preview */}
          {selectedDayTasks && (
            <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-slate-900/40 backdrop-blur-xs select-none">
              <div className="relative w-full max-w-md bg-white h-full rounded-2xl shadow-xl border border-slate-100 flex flex-col p-6 animate-in slide-in-from-right duration-250">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <h3 className="text-sm font-extrabold text-[#1E3A5F] font-display uppercase tracking-widest">
                    Tasks Due: {selectedDayNum} {monthName} {calendarYear}
                  </h3>
                  <button
                    onClick={() => setSelectedDayTasks(null)}
                    className="text-slate-400 hover:text-slate-600 text-xs font-bold border border-slate-200 rounded-lg px-2.5 py-1.5 cursor-pointer"
                  >
                    Close detail
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4">
                  {selectedDayTasks.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-10 font-bold">
                      No statutory filings are registered for this date.
                    </p>
                  ) : (
                    selectedDayTasks.map(tk => (
                      <TaskRow key={tk.id} task={tk} onComplete={completeTask} />
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
