/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import {
  Send,
  MessageSquare,
  Users,
  Eye,
  Mail,
  CheckCircle,
} from 'lucide-react';

export const RemindersHub: React.FC = () => {
  const { clients, reminderLogs, sendReminder, showToast } = useAppHelper();

  // 1. Core State
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState(0);
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>(clients.slice(0, 2).map(c => c.id));
  const [activeChannel, setActiveChannel] = useState<'whatsapp' | 'email' | 'both'>('whatsapp');

  // Multi templates reference
  const templates = [
    {
      title: 'Friendly Nudge (Pre-Due)',
      subject: 'Upcoming Statutory Filing Reminder',
      body: 'Hi {{client_name}}, a gentle reminder that {{task_name}} is due on {{due_date}}. Please share books of accounts to avoid statutory delay fees.'
    },
    {
      title: 'Urgent Warning (Impending Penalty)',
      subject: 'URGENT: Impending Deadline Penalty Alert',
      body: 'URGENT: {{task_name}} is corporate due in 3 days. Statutory late filing fee of ₹{{penalty_rate}}/day applies after {{due_date}}.'
    },
    {
      title: 'Overdue Alert (Escalated Penalty)',
      subject: 'CRITICAL: STATUTORY COMPLIANCE IS OVERDUE',
      body: 'CRITICAL: {{task_name}} has exceeded its statutory deadline of {{due_date}}. Accumulated late penalty: ₹{{accumulated_penalty}}. Connect with Yadav & Associates immediately.'
    },
    {
      title: 'Document Renewal Warning',
      subject: 'Action Required: License Expring Soon',
      body: 'Hi {{client_name}}, your statutory license FSSAI Food License / Trade certificate expires on {{due_date}}. Please send renewal forms to prevent closures.'
    }
  ];

  // Selected clients helper
  const handleToggleClientCheckbox = (clientId: string) => {
    setSelectedClientIds(prev =>
      prev.includes(clientId)
        ? prev.filter(id => id !== clientId)
        : [...prev, clientId]
    );
  };

  // Render previews based on selected templates and first selected client
  const renderMessageTextForClient = (clientObj: typeof clients[0] | undefined) => {
    if (!clientObj) return 'Select a client to preview personalized notification...';
    
    // Choose some values for preview
    const taskNamePreview = 'GSTR-3B monthly tax summary';
    const dueDatePreview = '2026-06-20';
    const penaltyRatePreview = clientObj.type === 'Private Limited' ? '100' : '50';
    
    // Replace custom tokens
    let text = templates[selectedTemplateIndex].body;
    text = text.replace(/\{\{client_name\}\}/g, clientObj.name);
    text = text.replace(/\{\{task_name\}\}/g, taskNamePreview);
    text = text.replace(/\{\{due_date\}\}/g, dueDatePreview);
    text = text.replace(/\{\{penalty_rate\}\}/g, penaltyRatePreview);
    text = text.replace(/\{\{accumulated_penalty\}\}/g, '1,200');

    return text;
  };

  const handleBroadcastLogs = () => {
    if (selectedClientIds.length === 0) {
      showToast('Error: Select at least one client to nudge', 'error');
      return;
    }

    selectedClientIds.forEach(id => {
      const cl = clients.find(c => c.id === id);
      if (cl) {
        sendReminder({
          clientId: cl.id,
          clientName: cl.name,
          taskName: 'GSTR-3B filings summary',
          taskDueDate: '2026-06-20',
          penaltyWarningAmount: cl.type === 'Private Limited' ? 1200 : 500,
          message: renderMessageTextForClient(cl),
          channel: activeChannel,
          status: 'delivered',
          templateUsed: templates[selectedTemplateIndex].title,
        });
      }
    });

    showToast(`✓ broadcast queued! nudge delivered to ${selectedClientIds.length} partners.`, 'success');
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      {/* Title Header split */}
      <div className="border-b border-slate-100 pb-3 select-none">
        <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
          Reminders Broadcast Center
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Push live SMS, WhatsApp, and Emails to clients regarding upcoming due dates.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Board Controls: Template & Selection (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Templates Library */}
          <Card className="p-5 select-none">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              1. Select Statutory Messaging Template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {templates.map((t, idx) => (
                <div
                  key={t.title}
                  onClick={() => setSelectedTemplateIndex(idx)}
                  className={`border p-3.5 rounded-xl cursor-pointer hover:border-slate-300 transition-all ${
                    selectedTemplateIndex === idx
                      ? 'border-[#1E3A5F] ring-2 ring-[#1E3A5F]/15 bg-[#1E3A5F]/5'
                      : 'border-slate-200'
                  }`}
                >
                  <span className="text-xs font-extrabold text-slate-800 block">
                    {t.title}
                  </span>
                  <span className="text-[10px] text-slate-400 font-semibold truncate block mt-1">
                    Subject: {t.subject}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Client Targets Multiselect */}
          <Card className="p-5 font-sans">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              2. Select Client Recipients List
            </h3>
            <div className="max-h-56 overflow-y-auto border border-slate-100 rounded-xl divide-y divide-slate-100">
              {clients.map(cl => {
                const isSelected = selectedClientIds.includes(cl.id);
                return (
                  <div
                    key={cl.id}
                    onClick={() => handleToggleClientCheckbox(cl.id)}
                    className="p-3 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => {}} // handled by parent onClick
                        className="w-4 h-4 accent-[#1E3A5F] rounded-md shrink-0 pointer-events-none"
                      />
                      <div>
                        <span className="text-xs font-extrabold text-slate-800">{cl.name}</span>
                        <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                          {cl.contactPersonName} • {cl.phone}
                        </span>
                      </div>
                    </div>
                    <Badge variant={cl.status === 'compliant' ? 'success' : 'warning'}>
                      {cl.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Deliver Settings Control */}
          <Card className="p-5 select-none font-semibold">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              3. Select Broadcast Channels
            </h3>
            <div className="flex items-center gap-2 mb-4">
              {['whatsapp', 'email', 'both'].map(ch => (
                <button
                  key={ch}
                  onClick={() => setActiveChannel(ch as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    activeChannel === ch
                      ? 'bg-[#1E3A5F] text-white border-transparent'
                      : 'bg-white text-slate-500 border-slate-200'
                  }`}
                >
                  {ch.toUpperCase()}
                </button>
              ))}
            </div>

            <Button onClick={handleBroadcastLogs} className="w-full font-bold flex items-center justify-center gap-2 py-3 shadow-xs">
              <Send className="w-4 h-4" />
              <span>Broadcast Nudge alerts to {selectedClientIds.length} partners</span>
            </Button>
          </Card>

        </div>

        {/* Right Board Preview: Live Message Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-widest mb-1 select-none">
            👁️ Personalized Message Live Preview
          </h3>
          <Card className="p-5 flex-1 relative flex flex-col justify-between min-h-[300px]">
            {selectedClientIds.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <MessageSquare className="w-4 h-4 text-[#F97316]" />
                  <span className="text-xs font-extrabold text-slate-800 uppercase">
                    Preview (Recipient: {clients.find(c => c.id === selectedClientIds[0])?.contactPersonName})
                  </span>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl text-slate-700 text-xs font-semibold select-text leading-relaxed whitespace-pre-wrap text-left font-sans italic my-4 min-h-[160px]">
                  {renderMessageTextForClient(clients.find(c => c.id === selectedClientIds[0]))}
                </div>

                <p className="text-[10px] text-slate-400">
                  Preview represents raw SMS formatting layout that handles variables compilation in real-time.
                </p>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 select-none">
                Select at least one client to construct a live compiled rendering.
              </div>
            )}
          </Card>
        </div>

      </div>

      {/* Dispatch logs tables (page 14 table) */}
      <div className="pt-8">
        <h3 className="text-sm font-bold font-display text-[#1E3A5F] uppercase tracking-wider mb-3">
          📜 Dispatch Broadcast Logs Ledger
        </h3>
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full font-sans text-xs text-left border-collapse text-slate-600 font-semibold select-none">
              <thead className="bg-[#1E3A5F]/5 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-3.5">Client Profile</th>
                  <th className="p-3.5">Statutory Task</th>
                  <th className="p-3.5">Channel</th>
                  <th className="p-3.5">Sent DateTime</th>
                  <th className="p-3.5 text-right font-display pr-6">Delivery status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {reminderLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/50">
                    <td className="p-3.5 font-bold text-slate-800">{log.clientName}</td>
                    <td className="p-3.5 text-xs text-slate-500 font-semibold leading-relaxed">{log.taskName}</td>
                    <td className="p-3.5 font-mono uppercase text-[#F97316] text-[10px]">{log.channel}</td>
                    <td className="p-3.5 font-mono text-slate-400 font-bold">{log.sentAt}</td>
                    <td className="p-3.5 text-right pr-6">
                      <Badge variant={log.status === 'delivered' ? 'success' : 'warning'}>
                        {log.status === 'delivered' ? '✓ Delivered' : 'Pending'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
};
