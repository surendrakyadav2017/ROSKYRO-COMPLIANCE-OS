/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { FileText, FileImage, FileCode, Trash2, Globe, Eye, Download, EyeOff } from 'lucide-react';
import { ClientDocument } from './types';
import { Badge } from './Badge';
import { useAppHelper } from './AppContext';

interface DocumentCardProps {
  doc: ClientDocument;
  onPreview: (doc: ClientDocument) => void;
  onDelete: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  hideClientLabel?: boolean;
}

export const DocumentCard: React.FC<DocumentCardProps> = ({
  doc,
  onPreview,
  onDelete,
  onToggleVisibility,
  hideClientLabel = false,
}) => {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const getDocTypeIcon = () => {
    if (doc.mimeType?.includes('image')) return <FileImage className="w-9 h-9 text-[#F97316]" />;
    if (doc.mimeType?.includes('pdf')) return <FileText className="w-9 h-9 text-red-500" />;
    return <FileCode className="w-9 h-9 text-slate-500" />;
  };

  const getCategoryColor = (category: ClientDocument['category']) => {
    switch (category) {
      case 'GST': return 'primary';
      case 'TDS': return 'secondary';
      case 'ROC': return 'info';
      case 'License': return 'warning';
      case 'Identity': return 'success';
      default: return 'neutral';
    }
  };

  // Expiry check
  const getExpiryLabel = () => {
    if (!doc.expiryDate) return { text: 'Permanent Document', style: 'text-slate-400 bg-slate-50 border-slate-100' };

    const exp = new Date(doc.expiryDate);
    const anchor = new Date('2026-06-15'); // simulated anchor date
    const diffTime = exp.getTime() - anchor.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return { text: 'EXPIRED', style: 'text-red-700 bg-red-100 border-red-200 font-extrabold' };
    }
    if (diffDays < 30) {
      return { text: `Expires in ${diffDays} days`, style: 'text-red-600 bg-red-50 border-red-100 font-bold' };
    }
    if (diffDays < 90) {
      return { text: `Expires in ${diffDays} days`, style: 'text-amber-800 bg-amber-50 border-amber-100 font-bold' };
    }
    return { text: `Expiry: ${doc.expiryDate}`, style: 'text-slate-500 bg-slate-50 border-slate-100' };
  };

  const expiryMeta = getExpiryLabel();

  const triggerDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Simulate direct download
    const element = document.createElement('a');
    const file = new Blob([atob(doc.content || '')], { type: doc.mimeType || 'application/pdf' });
    element.href = URL.createObjectURL(file);
    element.download = doc.fileName;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDeleteTrigger = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowConfirmDelete(true);
    setDeleteConfirmText('');
  };

  const handleConfirmDelete = (e: React.FormEvent) => {
    e.preventDefault();
    if (deleteConfirmText === 'DELETE') {
      onDelete(doc.id);
      setShowConfirmDelete(false);
    }
  };

  return (
    <div className="bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl p-4 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 select-none font-sans relative flex flex-col justify-between">
      <div>
        {/* Document Card Header */}
        <div className="flex gap-3.5 mb-3.5">
          <div className="shrink-0">{getDocTypeIcon()}</div>
          <div className="min-w-0 flex-1 text-left">
            <h4
              onClick={() => onPreview(doc)}
              className="text-sm font-bold text-slate-800 line-clamp-1 hover:text-[#1E3A5F] cursor-pointer"
            >
              {doc.name}
            </h4>
            <p className="text-[10px] text-slate-400 font-bold font-mono tracking-tight mt-0.5 select-all">
              {doc.fileName} • {doc.fileSize}
            </p>
            {!hideClientLabel && (
              <p className="text-xs text-slate-500 font-semibold truncate mt-1">
                Client: {doc.clientName}
              </p>
            )}
          </div>
        </div>

        {/* Categories / Expirations */}
        <div className="flex flex-wrap items-center gap-1.5 mt-3">
          <Badge variant={getCategoryColor(doc.category)}>{doc.category}</Badge>
          <span className={`text-[11px] font-medium border px-2 py-0.5 rounded-md font-sans ${expiryMeta.style}`}>
            {expiryMeta.text}
          </span>
        </div>
      </div>

      {/* Buttons and toggles */}
      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between gap-1.5">
        {/* Share to Portal toggle */}
        <button
          onClick={() => onToggleVisibility(doc.id)}
          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-1 rounded-md transition-colors cursor-pointer ${
            doc.isVisibleToClient
              ? 'bg-[#0F766E]/10 text-[#0F766E]'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
          }`}
          title={doc.isVisibleToClient ? 'Visible to Client Website Portal' : 'Private to CA Workspace'}
        >
          {doc.isVisibleToClient ? <Globe className="w-3.5 h-3.5 text-[#0F766E]" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
          <span>{doc.isVisibleToClient ? 'Visible' : 'Private'}</span>
        </button>

        {/* Quick file tools */}
        <div className="flex items-center gap-1 ml-auto">
          <button
            onClick={() => onPreview(doc)}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#1E3A5F] rounded-lg transition-colors cursor-pointer"
            title="Preview details"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={triggerDownload}
            className="p-1.5 hover:bg-slate-50 border border-slate-200 text-slate-500 hover:text-[#1E3A5F] rounded-lg transition-colors cursor-pointer"
            title="Download base64 file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleDeleteTrigger}
            className="p-1.5 hover:bg-red-50 border border-slate-200 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
            title="Delete document"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Delete Confirmation Overlay with strict pattern: Confirmation modals — destructive actions (delete client, delete document) require typing "DELETE" to confirm */}
      {showConfirmDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-xl shadow-xl border border-slate-100 max-w-sm w-full p-6 flex flex-col gap-4 animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-slate-900 font-display">
              Confirm Document Destruction
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              Warning: Deleting <strong>"{doc.name}"</strong> is permanent and cannot be undone. To proceed, please type <strong className="text-red-700">DELETE</strong> below.
            </p>
            <form onSubmit={handleConfirmDelete} className="flex flex-col gap-3">
              <input
                type="text"
                required
                value={deleteConfirmText}
                onChange={e => setDeleteConfirmText(e.target.value)}
                placeholder="Type DELETE to confirm"
                className="w-full text-xs font-mono px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
              />
              <div className="flex gap-2 justify-end mt-1">
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(false)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-sans cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={deleteConfirmText !== 'DELETE'}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white font-sans disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  Confirm Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
