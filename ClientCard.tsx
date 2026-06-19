/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Eye, Edit, Bell } from 'lucide-react';
import { Client } from './types';
import { ProgressRing } from './ProgressRing';
import { Badge } from './Badge';
import { useAppHelper } from './AppContext';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onRemind: (client: Client) => void;
  onSelect: (clientId: string) => void;
}

export const ClientCard: React.FC<ClientCardProps> = ({ client, onEdit, onRemind, onSelect }) => {
  const { setSelectedClientId, setActiveTab } = useAppHelper();

  // GSTIN Mask helper (masks 4 characters, e.g. 27AABCG****1Z5)
  const maskGSTIN = (gst: string) => {
    if (!gst || gst.length < 15) return gst;
    return `${gst.substring(0, 7)}****${gst.substring(11)}`;
  };

  const getStatusVariant = (status: Client['status']) => {
    switch (status) {
      case 'compliant': return 'success';
      case 'active': return 'primary';
      case 'at_risk': return 'warning';
      case 'inactive': return 'neutral';
      default: return 'neutral';
    }
  };

  const initials = client.name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleCardClick = () => {
    onSelect(client.id);
  };

  return (
    <div className="group bg-white border border-[#E2E8F0] hover:border-slate-300 rounded-xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-200 select-none font-sans relative flex flex-col justify-between">
      <div>
        {/* Uniqueness/Top section */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            {/* Avatar block */}
            <div className="w-11 h-11 rounded-full bg-[#1E3A5F]/15 text-[#1E3A5F] border border-[#1E3A5F]/10 flex items-center justify-center font-bold text-sm tracking-tight">
              {initials}
            </div>
            {/* Name Trade block */}
            <div>
              <h3 className="text-sm font-bold text-slate-800 line-clamp-1 group-hover:text-[#1E3A5F] transition-colors leading-tight cursor-pointer" onClick={handleCardClick}>
                {client.name}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1 font-medium select-text">
                {client.tradeName}
              </p>
            </div>
          </div>

          {/* Score circular ring */}
          <div className="shrink-0">
            <ProgressRing score={client.complianceScore} size={38} strokeWidth={3.5} />
          </div>
        </div>

        {/* GSTIN / PAN Block */}
        <div className="my-3 flex items-center gap-1.5 justify-between">
          <span className="text-[10px] font-bold text-slate-400 tracking-wider">GSTIN</span>
          <span className="text-xs font-bold font-mono text-slate-600 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-sm select-text">
            {maskGSTIN(client.gstin)}
          </span>
        </div>

        {/* Badges / Location info */}
        <div className="flex flex-wrap items-center gap-1.5 mt-4">
          <Badge variant={getStatusVariant(client.status)}>
            {client.status.toUpperCase().replace('_', ' ')}
          </Badge>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-medium">
            {client.type}
          </span>
          <span className="text-xs text-slate-400 bg-slate-50 border border-slate-100 px-1.5 py-0.5 rounded-md font-medium ml-auto">
            {client.city}
          </span>
        </div>
      </div>

      {/* Hover action bar overlay / reveal */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-end gap-1 px-1">
        <button
          onClick={handleCardClick}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1E3A5F] hover:bg-[#1E3A5F]/5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>View</span>
        </button>
        <button
          onClick={() => onEdit(client)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100 px-2.5 py-1.5 rounded-md transition-all cursor-pointer"
        >
          <Edit className="w-3.5 h-3.5" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onRemind(client)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#F97316] hover:bg-[#F97316]/5 px-2.5 py-1.5 rounded-md transition-all cursor-pointer ml-auto"
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Remind</span>
        </button>
      </div>
    </div>
  );
};
