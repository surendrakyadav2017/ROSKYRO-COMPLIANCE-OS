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
import { Modal } from './Modal';
import { ProgressRing } from './ProgressRing';
import {
  ShieldAlert,
  AlertTriangle,
  Upload,
  Clock,
  Sparkles,
  ClipboardList,
  FolderOpen,
} from 'lucide-react';

export const ClientDashboard: React.FC = () => {
  const { currentUser, clients, tasks, documents, showToast, uploadDocument, completeTask, setActiveTab } = useAppHelper();

  // Find client linked with this current client user profile
  const linkedClient = clients.find(c => c.portalEmail.toLowerCase() === currentUser?.email.toLowerCase()) || clients[0];

  const [uploadingForTaskId, setUploadingForTaskId] = useState<string | null>(null);
  const [docTitleInput, setDocTitleInput] = useState('');
  const [simulatedDocName, setSimulatedDocName] = useState('');

  if (!linkedClient) {
    return (
      <div className="flex-1 p-8 text-center text-slate-400 select-none">
        No linked business profile detected. Please contact your CA, Surendra K. Yadav.
      </div>
    );
  }

  // Linked items
  const activeClientTasks = tasks.filter(t => t.clientId === linkedClient.id);
  const pendingTasks = activeClientTasks.filter(t => t.status !== 'completed');
  const completedTasks = activeClientTasks.filter(t => t.status === 'completed');

  const clientDocuments = documents.filter(d => d.clientId === linkedClient.id && d.isVisibleToClient);

  // Compliance percentage rate
  const completionRate = activeClientTasks.length
    ? Math.round((completedTasks.length / activeClientTasks.length) * 100)
    : 100;

  const handleOpenClientUpload = (taskId: string, name: string) => {
    setUploadingForTaskId(taskId);
    setDocTitleInput(`Book audit - ${name}`);
    setSimulatedDocName(`client_books_${name.toLowerCase().replace(/\s+/g, '_')}.pdf`);
  };

  const handleClientFileUploadConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadingForTaskId) return;

    // Simulate file submission to vault
    uploadDocument({
      clientId: linkedClient.id,
      clientName: linkedClient.name,
      name: docTitleInput,
      category: 'GST',
      fileName: simulatedDocName,
      fileSize: '350 KB',
      mimeType: 'application/pdf',
      content: 'JVBERi0xLjQKJSDi48...',
      uploadedBy: linkedClient.contactPersonName,
      uploadDate: new Date().toISOString().split('T')[0],
      isVisibleToClient: true,
      description: `Uploaded from client self-service portal directly on task checkout.`,
      tags: ['portal', 'uploaded-by-client'],
    });

    // Mark task complete with mock ack number
    const mockAck = `PORTAL-${Math.floor(100000 + Math.random() * 900000)}`;
    completeTask(uploadingForTaskId, mockAck);

    setUploadingForTaskId(null);
    showToast('✓ Books and filings submitted. CA Yadav notified for statutory audit!', 'success');
  };

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      {/* Hello Brand Header */}
      <div className="bg-[#1E3A5F] rounded-2xl border border-[#1E3A5F]/15 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center text-white select-none relative overflow-hidden shadow-md">
        <div className="space-y-1 relative z-10">
          <span className="text-[10px] bg-sky-500/30 text-sky-200 border border-sky-400/20 rounded-md font-mono font-extrabold px-1.5 py-0.5 tracking-widest leading-none uppercase">
            Client Portal Active
          </span>
          <h2 className="text-xl font-extrabold font-display tracking-tight pt-2">
            Welcome back, {linkedClient.contactPersonName}!
          </h2>
          <p className="text-xs text-sky-200/80 font-medium font-sans">
            Managing compliance for: <strong className="text-white underline">{linkedClient.name}</strong> • GSTIN: {linkedClient.gstin}
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-1.5 shrink-0 bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold select-text">
          <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
          <span>Need help? Contact Surendra Yadav: <strong className="text-[#A3E635]">+91 9930219803</strong></span>
        </div>
      </div>

      {/* KPI summaries cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 select-none">
        
        <Card hoverEffect className="p-5 flex items-center justify-between">
          <div className="text-left font-sans">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
              Business Compliance Rate
            </span>
            <span className="text-2xl font-extrabold font-display text-[#0F766E] block mt-1">
              {completionRate}%
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Standard track score</span>
          </div>
          <ProgressRing score={completionRate} size={44} strokeWidth={4.2} />
        </Card>

        <Card hoverEffect className="p-5 flex items-center justify-between">
          <div className="text-left font-sans">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
              Open Request Items
            </span>
            <span className={`text-2xl font-extrabold font-display block mt-1 ${
              pendingTasks.length > 0 ? 'text-[#F97316]' : 'text-[#0F766E]'
            }`}>
              {pendingTasks.length} pending
            </span>
            <span className="text-[10px] text-slate-400 font-medium">Needs book submissions</span>
          </div>
          <div className="bg-[#F97316]/10 text-[#F97316] p-2.5 rounded-lg border border-[#F97316]/10">
            <ClipboardList className="w-5 h-5" />
          </div>
        </Card>

        <Card hoverEffect className="p-5 flex items-center justify-between">
          <div className="text-left font-sans">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
              Penalties Saved (YTD)
            </span>
            <span className="text-2xl font-extrabold font-mono text-[#0F766E] block mt-1">
              {formatINR(linkedClient.totalSavedPenalty)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 border border-emerald-100 rounded-md w-fit block mt-1.5">
              ROSKYRO Guarded
            </span>
          </div>
          <div className="bg-emerald-50 text-[#0F766E] p-2.5 rounded-lg border border-emerald-100">
            <Sparkles className="w-5 h-5 text-[#0F766E]" />
          </div>
        </Card>
      </div>

      {/* Main layout split: Tasks list left, Documents Vault Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Hand: Pending Tasks Checklist (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-wider mb-1 select-none">
            📋 Pending Compliance checklist Actions
          </h3>
          <Card className="p-5 space-y-4 max-h-[480px] overflow-y-auto divide-y divide-slate-100">
            {pendingTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-400 select-none">
                Perfect! No pending compliance checks. Your practice is fully secure.
              </div>
            ) : (
              pendingTasks.map(tk => (
                <div key={tk.id} className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
                  <div>
                    <span className="inline-block text-[9px] font-bold border border-cyan-200 bg-cyan-50 text-cyan-700 font-mono px-2 py-0.5 rounded-sm tracking-tight mb-1">
                      {tk.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800">
                      {tk.name} ({tk.shortCode})
                    </h4>
                    <p className="text-[10px] text-slate-400 font-semibold font-mono mt-0.5">
                      Statutory Due Date: {new Date(tk.dueDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <Button onClick={() => handleOpenClientUpload(tk.id, tk.name)} size="sm" variant="accent" className="flex items-center gap-1 font-bold shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload & Clear</span>
                  </Button>
                </div>
              ))
            )}
          </Card>
        </div>

        {/* Right Hand: Approved Vault Files (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <h3 className="text-sm font-bold font-display text-slate-800 uppercase tracking-widest mb-1 select-none">
            📁 Shared Documents Vault (Surendra Yadav Verified)
          </h3>
          <Card className="p-5 max-h-[480px] overflow-y-auto space-y-4">
            {clientDocuments.length === 0 ? (
              <div className="py-20 text-slate-400 text-center text-xs select-none">
                No shared files or tax certs uploaded into Document Vault.
              </div>
            ) : (
              clientDocuments.map(doc => (
                <div key={doc.id} className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4 text-left font-sans">
                  <div className="min-w-0">
                    <span className="inline-block text-[9px] font-bold bg-slate-100 text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded-md font-mono uppercase mb-1">
                      {doc.category}
                    </span>
                    <h4 className="text-xs font-bold text-slate-800 truncate">{doc.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{doc.fileName} • {doc.fileSize}</p>
                  </div>
                  
                  {/* Mock download */}
                  <Button size="xs" variant="secondary" onClick={() => showToast(`✓ Certificate ${doc.name} downloaded!`, 'success')} className="font-bold shrink-0 border-slate-200 select-none">
                    Download
                  </Button>
                </div>
              ))
            )}
          </Card>
        </div>

      </div>

      {/* File upload action modal */}
      {uploadingForTaskId && (
        <Modal
          isOpen={!!uploadingForTaskId}
          onClose={() => setUploadingForTaskId(null)}
          title="Attach Books and Submit Returns File"
        >
          <form onSubmit={handleClientFileUploadConfirm} className="space-y-4 font-sans text-xs font-semibold text-left">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Statutory Document Label
              </label>
              <input
                type="text"
                required
                value={docTitleInput}
                onChange={e => setDocTitleInput(e.target.value)}
                className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                Simulated File Name
              </label>
              <input
                type="text"
                required
                value={simulatedDocName}
                onChange={e => setSimulatedDocName(e.target.value)}
                className="w-full text-xs font-mono font-bold px-3 py-2 border border-slate-200 text-slate-500 rounded-lg bg-slate-50"
              />
            </div>

            <div className="border border-indigo-200 bg-indigo-50/20 p-4 rounded-xl text-center text-indigo-900 border-dashed relative">
              <Upload className="w-8 h-8 text-indigo-400 mx-auto mb-1" />
              <p className="font-bold">Files locked ready for uploading</p>
              <p className="text-[10px] text-slate-400 mt-0.5">client_books_compiled.pdf (350 KB)</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setUploadingForTaskId(null)}>Cancel</Button>
              <Button variant="success" size="sm" type="submit">Complete checkout & Submit</Button>
            </div>
          </form>
        </Modal>
      )}

    </div>
  );
};
