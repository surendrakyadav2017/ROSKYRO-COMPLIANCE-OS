/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { DocumentCard } from './DocumentCard';
import { Button } from './Button';
import { Card } from './Card';
import { Modal } from './Modal';
import { Badge } from './Badge';
import {
  UploadCloud,
  FileWarning,
  Search,
  CheckCircle,
  Database,
  Folders,
} from 'lucide-react';
import { ClientDocument } from './types';

export const DocumentVault: React.FC = () => {
  const { clients, documents, uploadDocument, deleteDocument, toggleDocumentVisibility, showToast } = useAppHelper();

  // Search/Filters states
  const [docSearchQuery, setDocSearchQuery] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('All');

  // Modal Control
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Upload Form States
  const [clientSelector, setClientSelector] = useState('');
  const [docName, setDocName] = useState('');
  const [docCategory, setDocCategory] = useState<'GST' | 'TDS' | 'ROC' | 'License' | 'Identity' | 'Financial' | 'Other'>('GST');
  const [docExpiry, setDocExpiry] = useState('');
  const [docDesc, setDocDesc] = useState('');
  const [docIsVisible, setDocIsVisible] = useState(true);

  // File drag simulation states
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  // 1. Calculations: Storage Used
  const totalStorageAllocatedMb = 100;
  // Let's assume each documents registers 1.5MB average size
  const approximatedUsedMb = (documents.length * 1.5).toFixed(1);
  const matchedPercentage = Math.min(100, Math.round((Number(approximatedUsedMb) / totalStorageAllocatedMb) * 100));

  // 2. Calculation: Expiring docs (expires within 90 days from June 15, 2026)
  const anchorDateObj = new Date('2026-06-15');
  const expiringSoonDocs = documents.filter(d => {
    if (!d.expiryDate) return false;
    const exp = new Date(d.expiryDate);
    const diff = exp.getTime() - anchorDateObj.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 && days <= 90;
  });

  // Expiring days calc for header
  const getDaysLeft = (expiryDateStr: string) => {
    const exp = new Date(expiryDateStr);
    const diff = exp.getTime() - anchorDateObj.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setUploadedFileName(file.name);
      if (!docName) {
        // Auto pull name without extension
        setDocName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploadedFileName(file.name);
      if (!docName) {
        setDocName(file.name.replace(/\.[^/.]+$/, ''));
      }
    }
  };

  const handleOpenUploadModal = () => {
    setClientSelector(clients[0]?.id || '');
    setDocName('');
    setDocDesc('');
    setDocExpiry('');
    setDocCategory('GST');
    setUploadedFileName('');
    setDocIsVisible(true);
    setIsUploadOpen(true);
  };

  const handleSaveUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim() || !clientSelector) {
      showToast('Error: Complete Client Selection and Document Title map.', 'error');
      return;
    }

    const matchedClient = clients.find(c => c.id === clientSelector);
    if (!matchedClient) return;

    uploadDocument({
      clientId: matchedClient.id,
      clientName: matchedClient.name,
      name: docName,
      category: docCategory,
      fileName: uploadedFileName || `${docName.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      fileSize: uploadedFileName ? '2.1 MB' : '1.5 MB',
      mimeType: 'application/pdf',
      content: 'JVBERi0xLjQKJSDi48clN0YXJ0b2ZPYmplY3QK... (mock PDF string)',
      uploadedBy: 'Surendra K. Yadav',
      uploadDate: '2026-06-15',
      expiryDate: docExpiry,
      isVisibleToClient: docIsVisible,
      description: docDesc,
      tags: [docCategory.toLowerCase(), 'cloud-trigger'],
    });

    setIsUploadOpen(false);
  };

  // Searching filter logic
  const filteredDocs = documents.filter(d => {
    const matchesSearch =
      d.name.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      d.clientName.toLowerCase().includes(docSearchQuery.toLowerCase()) ||
      d.fileName.toLowerCase().includes(docSearchQuery.toLowerCase());

    const matchesCat = selectedCategoryFilter === 'All' || d.category === selectedCategoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-slate-100 pb-3 select-none">
        <div>
          <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
            Document Vault Cloud
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Store, audit, and share tax certificates & statutory records with customers.
          </p>
        </div>
        <Button onClick={handleOpenUploadModal} className="flex items-center gap-1.5 font-bold shrink-0 shadow-xs">
          <UploadCloud className="w-4 h-4" />
          <span>Upload New Certificate</span>
        </Button>
      </div>

      {/* Storage Used summary progress bar */}
      <Card className="p-4 flex items-center justify-between select-none">
        <div className="flex items-center gap-3 w-2/3">
          <div className="bg-[#1E3A5F]/10 text-[#1E3A5F] p-2.5 rounded-lg border border-[#1E3A5F]/10">
            <Database className="w-5 h-5" />
          </div>
          <div className="w-full">
            <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
              <span>Cloud Storage Used</span>
              <span className="font-mono text-slate-500">
                {approximatedUsedMb} MB of {totalStorageAllocatedMb} MB allocated
              </span>
            </div>
            {/* Storage Progress bar strip */}
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden border border-slate-200/50">
              <div
                className="bg-[#1E3A5F] h-2 rounded-full transition-all duration-300"
                style={{ width: `${matchedPercentage}%` }}
              />
            </div>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-wider font-extrabold text-slate-400 block">
            Cloud Files Count
          </span>
          <span className="text-xl font-extrabold font-display text-slate-800">
            {documents.length} pdfs
          </span>
        </div>
      </Card>

      {/* Expiry alerts banner */}
      {expiringSoonDocs.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3 text-amber-800 animate-in slide-in-from-top-4">
          <FileWarning className="w-6 h-6 text-[#F97316] shrink-0 mt-0.5" />
          <div className="text-xs font-semibold">
            <h4 className="font-bold text-amber-900 uppercase tracking-wide">
              ⚠️ {expiringSoonDocs.length} statutory documents expiring within 90 days
            </h4>
            <div className="mt-1.5 space-y-1">
              {expiringSoonDocs.map(doc => (
                <div key={doc.id}>
                  • <strong className="text-amber-950">"{doc.name}"</strong> under <span className="underline">{doc.clientName}</span>, expires in <strong className="text-red-700">{getDaysLeft(doc.expiryDate)} days</strong> ({doc.expiryDate}).
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Search & Category Filter bar */}
      <div className="bg-white border border-[#E2E8F0] p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.03)] flex flex-col sm:flex-row gap-4 items-center justify-between select-none">
        
        {/* Search */}
        <div className="w-full sm:max-w-md relative">
          <input
            type="text"
            value={docSearchQuery}
            onChange={e => setDocSearchQuery(e.target.value)}
            placeholder="Search certificates by title, client name, filename..."
            className="w-full text-xs font-semibold pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F] rounded-lg"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Categories filters */}
        <select
          value={selectedCategoryFilter}
          onChange={e => setSelectedCategoryFilter(e.target.value)}
          className="text-xs bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-lg font-bold text-slate-600 focus:outline-none cursor-pointer w-full sm:w-auto"
        >
          <option value="All">All Categories</option>
          <option value="GST">GST Returns</option>
          <option value="TDS">TDS Challans</option>
          <option value="ROC">ROC filings</option>
          <option value="License">Licenses & NOCs</option>
          <option value="Identity">Identity (PAN/TAN)</option>
          <option value="Financial">Financial Reports</option>
          <option value="Other">Other</option>
        </select>
      </div>

      {/* Vault Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
        {filteredDocs.length === 0 ? (
          <div className="col-span-3 py-16 bg-white border border-[#E2E8F0] rounded-xl text-center text-slate-400 flex flex-col items-center justify-center gap-2">
            <Folders className="w-10 h-10 text-slate-300" />
            <h4 className="text-sm font-bold text-slate-700">No vault files matched query</h4>
            <p className="text-xs">Adjust searching criteria or click upload to register a client document.</p>
          </div>
        ) : (
          filteredDocs.map(doc => (
            <DocumentCard
              key={doc.id}
              doc={doc}
              onPreview={(d) => showToast(`Preview certificate: ${d.name}`, 'info')}
              onDelete={deleteDocument}
              onToggleVisibility={toggleDocumentVisibility}
            />
          ))
        )}
      </div>

      {/* Upload modal item */}
      <Modal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        title="Upload Statutory Certificate"
      >
        <form onSubmit={handleSaveUpload} className="space-y-4 font-sans text-xs font-semibold text-left">
          
          {/* Client Selector (dropdown) */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Select Client Account
            </label>
            <select
              value={clientSelector}
              onChange={e => setClientSelector(e.target.value)}
              className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
            >
              {clients.map(c => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Certificate Category
              </label>
              <select
                value={docCategory}
                onChange={e => setDocCategory(e.target.value as any)}
                className="w-full text-xs font-bold p-2.5 bg-white border border-slate-200 rounded-lg focus:outline-none"
              >
                <option value="GST">GST returns</option>
                <option value="TDS">TDS challans</option>
                <option value="ROC">ROC filings</option>
                <option value="License">Licenses & NOCs</option>
                <option value="Identity">Identity (PAN/TAN/COI)</option>
                <option value="Financial">Financial spreadsheets</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Expiry */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                Expiry Date (Leave blank if permanent)
              </label>
              <input
                type="date"
                value={docExpiry}
                onChange={e => setDocExpiry(e.target.value)}
                className="w-full text-xs p-2 border border-slate-200 bg-white rounded-lg focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Document Display Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={docName}
              onChange={e => setDocName(e.target.value)}
              placeholder="e.g. FSSAI Food License 2026-27"
              className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Document Description
            </label>
            <input
              type="text"
              value={docDesc}
              onChange={e => setDocDesc(e.target.value)}
              placeholder="Private instructions or memo details..."
              className="w-full text-xs font-bold px-3 py-2 border border-slate-200 rounded-lg focus:outline-none"
            />
          </div>

          {/* Drag and Drop Zone */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Select or Drop PDF File
            </label>
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition-colors relative ${
                dragActive
                  ? 'border-[#1E3A5F] bg-[#1E3A5F]/5'
                  : uploadedFileName
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200 bg-slate-50'
              }`}
            >
              {uploadedFileName ? (
                <div className="flex flex-col items-center gap-1.5 text-emerald-800">
                  <CheckCircle className="w-8 h-8 text-emerald-600" />
                  <span className="text-xs font-bold">{uploadedFileName}</span>
                  <span className="text-[10px] text-slate-400">File attached successfully</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-1.5 text-slate-500">
                  <UploadCloud className="w-8 h-8 text-slate-400" />
                  <span className="text-xs font-bold">Drag and drop file here, or click to browse</span>
                  <span className="text-[10px] text-slate-400">Supported formats: PDF, PNG, JPG (Max 5MB)</span>
                  <input
                    type="file"
                    onChange={handleFileInputChange}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Visibility toggle option */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-200/50 rounded-lg">
            <div>
              <h4 className="text-xs font-bold text-slate-800">Visible to customer portal</h4>
              <p className="text-[10px] text-slate-400 font-semibold mt-0.5">Let clients view, audit, and download this file directly.</p>
            </div>
            <input
              type="checkbox"
              checked={docIsVisible}
              onChange={e => setDocIsVisible(e.target.checked)}
              className="w-4 h-4 accent-[#1E3A5F] cursor-pointer"
            />
          </div>

          <div className="flex gap-2 justify-end pt-3 border-t border-slate-100">
            <Button variant="secondary" size="sm" onClick={() => setIsUploadOpen(false)}>Cancel</Button>
            <Button variant="success" size="sm" type="submit">Verify and Upload</Button>
          </div>
        </form>
      </Modal>

    </div>
  );
};
