/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { formatINR } from './utils';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { TaskRow } from './TaskRow';
import { DocumentCard } from './DocumentCard';
import { ProgressRing } from './ProgressRing';
import {
  Copy,
  Plus,
  Send,
  Upload,
  StickyNote,
  User,
  History,
  FileText,
  CheckSquare,
  ShieldAlert,
  Clock,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export const ClientDetail: React.FC = () => {
  const {
    selectedClientId,
    setSelectedClientId,
    clients,
    tasks,
    documents,
    reminderLogs,
    activityLogs,
    completeTask,
    sendReminder,
    uploadDocument,
    showToast,
    updateClient,
  } = useAppHelper();

  // Find single selected client
  const client = clients.find(c => c.id === selectedClientId);

  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'documents' | 'notes' | 'reminders' | 'portal_activity'>('tasks');

  // Input states for quick actions
  const [showNoteInputArea, setShowNoteInputArea] = useState(false);
  const [noteTextInput, setNoteTextInput] = useState('');

  const [showUploadDocArea, setShowUploadDocArea] = useState(false);
  const [docNameInput, setDocNameInput] = useState('');
  const [docCategory, setDocCategory] = useState<'GST' | 'TDS' | 'ROC' | 'License' | 'Identity' | 'Financial' | 'Other'>('GST');
  const [docExpiryDate, setDocExpiryDate] = useState('');

  if (!client) {
    return (
      <div className="flex-1 p-8 text-center text-slate-400 select-none font-sans">
        <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h3 className="text-sm font-bold text-slate-700">Client profile not found.</h3>
        <p className="text-xs">Select or add a client from directories listing.</p>
      </div>
    );
  }

  // 1. Tasks belonging to this client
  const clientTasks = tasks
    .filter(t => t.clientId === client.id)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // 2. Documents belonging to this client
  const clientDocuments = documents.filter(d => d.clientId === client.id);

  // 3. Reminder logs belonging to this client
  const clientReminders = reminderLogs.filter(r => r.clientId === client.id);

  // 4. Portal Logging belonging to client detail
  const clientActivities = activityLogs.filter(a => a.clientId === client.id);

  const handleCopy = (field: string, val: string) => {
    navigator.clipboard.writeText(val);
    showToast(`✓ Copied ${field}: ${val}`, 'success');
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteTextInput.trim()) return;

    const previousNotes = client.notes ? `${client.notes}\n` : '';
    const timestamp = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const updatedNotes = `${previousNotes}[${timestamp}] ${noteTextInput.trim()}`;

    updateClient(client.id, { notes: updatedNotes });
    setNoteTextInput('');
    setShowNoteInputArea(false);
    showToast('Success: Private CA note added successfully.', 'success');
  };

  const handleUploadDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docNameInput.trim()) return;

    uploadDocument({
      clientId: client.id,
      clientName: client.name,
      name: docNameInput,
      category: docCategory,
      fileName: `${docNameInput.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: '450 KB',
      mimeType: 'application/pdf',
      content: 'JVBERi0xLjQKJSDi48clN0YXJ0b2Z... (mock content)',
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: new Date().toISOString().split('T')[0],
      expiryDate: docExpiryDate,
      isVisibleToClient: true,
      description: `Uploaded from client profile: ${docNameInput}`,
      tags: [docCategory.toLowerCase()],
    });

    setDocNameInput('');
    setDocExpiryDate('');
    setShowUploadDocArea(false);
  };

  const triggerInstantReminder = () => {
    sendReminder({
      clientId: client.id,
      clientName: client.name,
      taskName: 'Comprehensive Statutory returns audit',
      taskDueDate: '2026-06-30',
      penaltyWarningAmount: client.type === 'Private Limited' ? 1200 : 500,
      message: 'Hi, this is Yadav & Associates. We noticed legal compliance activities are coming up. Please review files.',
      channel: 'both',
      status: 'delivered',
      templateUsed: 'Friendly Nudge',
    });
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      {/* Back to clients button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setSelectedClientId(null)}
          className="p-1.5 hover:bg-slate-50 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        <span className="text-xs text-slate-400 font-semibold select-none flex items-center gap-1">
          <span>Clients List</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-600 font-bold">{client.name}</span>
        </span>
      </div>

      {/* Main split grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Side Details Panel: 4 cols */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <Card className="p-6">
            <div className="flex flex-col items-center gap-3 text-center border-b border-slate-100 pb-5 mb-5 select-none">
              <div className="w-16 h-16 rounded-full bg-[#1E3A5F] text-white flex items-center justify-center font-extrabold text-lg shadow-md font-display">
                {client.name.substring(0,2).toUpperCase()}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 leading-tight">
                  {client.name}
                </h3>
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider font-mono mt-0.5 select-text">
                  {client.tradeName}
                </p>
              </div>

              {/* Status pill and Progress Ring */}
              <div className="flex items-center gap-3 mt-2">
                <Badge variant={client.status === 'compliant' ? 'success' : 'warning'}>
                  {client.status.toUpperCase()}
                </Badge>
                <ProgressRing score={client.complianceScore} size={36} strokeWidth={3} />
              </div>
            </div>

            {/* MONOSPACE copy blocks */}
            <div className="space-y-3.5 select-none font-sans text-xs">
              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold">GSTIN</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="bg-slate-50 border border-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-xs select-all">
                    {client.gstin}
                  </span>
                  <button onClick={() => handleCopy('GSTIN', client.gstin)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold">PAN</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="bg-slate-50 border border-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-xs select-all">
                    {client.pan}
                  </span>
                  <button onClick={() => handleCopy('PAN', client.pan)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                <span className="text-slate-400 font-semibold">TAN</span>
                <div className="flex items-center gap-1.5 font-mono">
                  <span className="bg-slate-50 border border-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded-xs select-all">
                    {client.tan}
                  </span>
                  <button onClick={() => handleCopy('TAN', client.tan)} className="text-slate-400 hover:text-slate-600 cursor-pointer">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 pt-2 text-slate-600 font-semibold">
                <div>Entity Type</div>
                <div className="text-right text-slate-800 font-bold">{client.type}</div>

                <div>Location City</div>
                <div className="text-right text-slate-800 font-bold">{client.city}, {client.state}</div>

                <div>Email ID</div>
                <div className="text-right text-slate-800 font-bold truncate select-all">{client.email}</div>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="border-t border-slate-100 pt-5 mt-5">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 select-none">
                — Quick Actions —
              </h4>
              <div className="flex flex-col gap-2 font-semibold">
                <Button variant="accent" size="sm" onClick={triggerInstantReminder} className="flex items-center gap-1.5 justify-start">
                  <Send className="w-3.5 h-3.5" />
                  <span>Send WhatsApp reminder</span>
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowUploadDocArea(!showUploadDocArea)} className="flex items-center gap-1.5 justify-start">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Certificate</span>
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setShowNoteInputArea(!showNoteInputArea)} className="flex items-center gap-1.5 justify-start border-slate-200 text-slate-600">
                  <StickyNote className="w-3.5 h-3.5" />
                  <span>Write private note</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* Conditional Note Area */}
          {showNoteInputArea && (
            <Card className="p-4 bg-slate-50 border border-slate-200/50 animate-in slide-in-from-top-4 duration-150">
              <form onSubmit={handleAddNote} className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700">Write private CA Note</h4>
                <textarea
                  required
                  rows={3}
                  value={noteTextInput}
                  onChange={e => setNoteTextInput(e.target.value)}
                  placeholder="Enter private memo detail..."
                  className="w-full text-xs p-2 border border-slate-200 bg-white rounded-lg focus:outline-none focus:ring-1 focus:ring-[#1E3A5F]"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" size="sm" onClick={() => setShowNoteInputArea(false)}>Cancel</Button>
                  <Button variant="primary" size="sm" type="submit">Save memo</Button>
                </div>
              </form>
            </Card>
          )}

          {/* Conditional Document Area */}
          {showUploadDocArea && (
            <Card className="p-4 bg-slate-50 border border-slate-200 animate-in slide-in-from-top-4 duration-150">
              <form onSubmit={handleUploadDocumentSubmit} className="space-y-3 font-sans text-xs font-semibold text-left">
                <h4 className="text-xs font-bold text-slate-700">Upload Statutory File</h4>
                
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">Document Name</label>
                  <input
                    type="text"
                    required
                    value={docNameInput}
                    onChange={e => setDocNameInput(e.target.value)}
                    placeholder="e.g. FSSAI Audit Copy"
                    className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Category</label>
                    <select
                      value={docCategory}
                      onChange={e => setDocCategory(e.target.value as any)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    >
                      <option value="GST">GST</option>
                      <option value="TDS">TDS</option>
                      <option value="ROC">ROC</option>
                      <option value="License">License</option>
                      <option value="Identity">Identity</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={docExpiryDate}
                      onChange={e => setDocExpiryDate(e.target.value)}
                      className="w-full p-2 bg-white border border-slate-200 rounded-lg focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-2 justify-end pt-2">
                  <Button variant="ghost" size="sm" onClick={() => setShowUploadDocArea(false)}>Cancel</Button>
                  <Button variant="success" size="sm" type="submit">Upload and share</Button>
                </div>
              </form>
            </Card>
          )}
        </div>

        {/* Right Side Main Board: 8 cols */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          
          {/* Sub-tabs header */}
          <div className="flex bg-white border border-[#E2E8F0] p-1.5 rounded-xl text-xs font-bold text-slate-400 select-none shadow-[0_1px_3px_rgba(0,0,0,0.03)] overflow-x-auto gap-1">
            <button
              onClick={() => setActiveSubTab('tasks')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'tasks' ? 'bg-[#1E3A5F] text-white' : 'hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Compliance Tasks ({clientTasks.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('documents')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'documents' ? 'bg-[#1E3A5F] text-white' : 'hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document Vault ({clientDocuments.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('notes')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'notes' ? 'bg-[#1E3A5F] text-white' : 'hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <StickyNote className="w-3.5 h-3.5" />
              <span>Private CA Notes</span>
            </button>
            <button
              onClick={() => setActiveSubTab('reminders')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'reminders' ? 'bg-[#1E3A5F] text-white' : 'hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Reminder History ({clientReminders.length})</span>
            </button>
            <button
              onClick={() => setActiveSubTab('portal_activity')}
              className={`px-4 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeSubTab === 'portal_activity' ? 'bg-[#1E3A5F] text-white' : 'hover:text-slate-700 hover:bg-slate-50'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Portal Activity ({clientActivities.length})</span>
            </button>
          </div>

          {/* Sub-tab Board Content */}
          <div className="flex-1 min-h-[400px]">
            {activeSubTab === 'tasks' && (
              <div className="space-y-4">
                {clientTasks.length === 0 ? (
                  <div className="p-12 text-center text-slate-400 bg-white border border-[#E2E8F0] rounded-xl font-sans">
                    No compliance tracks found.
                  </div>
                ) : (
                  clientTasks.map(task => (
                    <TaskRow key={task.id} task={task} onComplete={completeTask} hideClientName />
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'documents' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {clientDocuments.length === 0 ? (
                  <div className="col-span-2 p-12 text-center text-slate-400 bg-white border border-[#E2E8F0] rounded-xl font-sans">
                    No certificates or files uploaded in Document Vault.
                  </div>
                ) : (
                  clientDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      doc={doc}
                      onPreview={(d) => showToast(`Preview doc: ${d.name}`, 'info')}
                      onToggleVisibility={ () => {} } // handled at App level
                      onDelete={() => {}}
                      hideClientLabel
                    />
                  ))
                )}
              </div>
            )}

            {activeSubTab === 'notes' && (
              <Card className="p-5 font-sans h-full">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                  Private Practice Memos
                </h4>
                <div className="whitespace-pre-line text-xs font-semibold text-slate-600 space-y-2.5 leading-relaxed bg-slate-50 border border-slate-100 p-4 rounded-xl min-h-[250px] select-text">
                  {client.notes || 'No private memos logged. Click write private note on the left side to get started.'}
                </div>
              </Card>
            )}

            {activeSubTab === 'reminders' && (
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-semibold text-slate-600 font-sans border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                      <tr>
                        <th className="p-4">Reminders Target</th>
                        <th className="p-4">Channel</th>
                        <th className="p-4">Sent Time</th>
                        <th className="p-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {clientReminders.length === 0 ? (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-400 select-none font-sans">
                            No notifications sent yet.
                          </td>
                        </tr>
                      ) : (
                        clientReminders.map(log => (
                          <tr key={log.id} className="hover:bg-slate-50/50">
                            <td className="p-4 font-bold text-slate-800">{log.taskName}</td>
                            <td className="p-4 font-mono uppercase text-slate-400">{log.channel}</td>
                            <td className="p-4 text-slate-500 font-mono">{log.sentAt}</td>
                            <td className="p-4">
                              <Badge variant={log.status === 'delivered' ? 'success' : 'warning'}>
                                {log.status.toUpperCase()}
                              </Badge>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {activeSubTab === 'portal_activity' && (
              <Card className="overflow-hidden p-5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 font-mono">
                  Client Self-Service Trail
                </h4>
                <div className="flex flex-col gap-3">
                  {clientActivities.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-10 font-medium">
                      No portal activities logged by the client yet.
                    </p>
                  ) : (
                    clientActivities.map(act => (
                      <div key={act.id} className="text-xs font-semibold p-3.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-slate-700">{act.description}</span>
                        </div>
                        <span className="font-mono text-[10px] text-slate-400 shrink-0 font-bold">
                          {new Date(act.timestamp).toLocaleString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            )}

          </div>

        </div>

      </div>

    </div>
  );
};
