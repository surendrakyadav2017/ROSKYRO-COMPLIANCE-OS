/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useAppHelper } from './AppContext';
import { Button } from './Button';
import { Card } from './Card';
import { Badge } from './Badge';
import { FileText, Download, ShieldCheck, Search } from 'lucide-react';

export const ClientDocuments: React.FC = () => {
  const { currentUser, clients, documents, showToast } = useAppHelper();

  const linkedClient = clients.find(c => c.portalEmail.toLowerCase() === currentUser?.email.toLowerCase()) || clients[0];
  const [search, setSearch] = useState('');

  if (!linkedClient) return <div className="p-8 text-center text-slate-400">No linked client profile.</div>;

  const sharedFiles = documents.filter(d => d.clientId === linkedClient.id && d.isVisibleToClient && 
    (d.name.toLowerCase().includes(search.toLowerCase()) || d.fileName.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex-1 md:p-8 p-4 bg-[#F8FAFC] overflow-y-auto space-y-6 font-sans text-left pb-24 md:pb-8">
      
      <div className="border-b border-slate-100 pb-3">
        <h2 className="text-xl font-extrabold font-display text-slate-900 tracking-tight">
          Your Shared Documents Vault
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          View and download statutory certificates, filed GSTR transcripts, and assessment orders.
        </p>
      </div>

      <div className="w-full sm:max-w-md relative select-none">
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search certificates by name..."
          className="w-full text-xs font-semibold pl-9 pr-4 py-2 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-[#1E3A5F] rounded-lg bg-white"
        />
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sharedFiles.length === 0 ? (
          <div className="col-span-3 py-16 bg-white border border-[#E2E8F0] rounded-xl text-center text-slate-400">
            No files found under matching search.
          </div>
        ) : (
          sharedFiles.map(doc => (
            <Card key={doc.id} className="p-5 flex flex-col justify-between min-h-[160px] font-sans">
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="inline-block text-[9px] font-bold bg-indigo-50 border border-indigo-100 text-indigo-700 px-2 py-0.5 rounded-md font-mono tracking-wider uppercase">
                    {doc.category}
                  </span>
                  <div className="flex gap-1 items-center font-mono text-[9px] text-[#0F766E] font-bold bg-[#0F766E]/5 px-1.5 py-0.5 rounded-sm">
                    <ShieldCheck className="w-3 h-3" />
                    <span>CA VERIFIED</span>
                  </div>
                </div>

                <h4 className="text-sm font-extrabold text-slate-800 leading-tight truncate">
                  {doc.name}
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold font-mono mt-1 break-all">
                  {doc.fileName} • {doc.fileSize}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-bold">
                  Uploaded: {doc.uploadDate}
                </span>

                <Button
                  size="xs"
                  variant="outline"
                  onClick={() => showToast(`✓ File ${doc.name} downloaded!`, 'success')}
                  className="flex items-center gap-1 font-bold border-slate-200 text-slate-600"
                >
                  <Download className="w-3 h-3" />
                  <span>Download file</span>
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

    </div>
  );
};
